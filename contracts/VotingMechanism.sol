pragma solidity ^0.4.15;

/* This contract is our implementation of how voting should be done for shareholders in a company */

import "./Token.sol";

contract VotingMechanism {

    address admin;
    Token tok;
    enum VotingState {Voting, Revealing, Finished}
    struct VotingSession {
        /* What is your favo? 1. opfjdsa 2.dfjkaslf 3.fdjkslajf */
        string question;
        uint[] totalVotes;
        uint numOptions;
        uint startingPhaseTime;
        uint phaseLength;
        VotingState state;
        mapping (address => Vote) voters;
    }
    uint currentSession = 0;
    mapping (uint => VotingSession) votingSessions;
  	// Last session that each user has participated in
  	// If last voting session is 0, then the user can vote again
    mapping (address => uint) lockedSessions;

  	//interest would be like 1.001 * 10^18, so that interest/interestFactor = 1 + interest percentage
    uint interestFactor = 10**18;
  	//needs to be a uint cuz solidity doesn't do floats -_-
    uint interest = (101)*(10**16);
    //interest should really be a construction / config parameter
    struct Vote {
        /* H(secret||_vote[]) stored here for each voter */
        bytes32 blindedVote;
        bool voted;
        bool revealed;
      	uint[] values;
    }

    uint[] altResults;

    event VoteStarted();
    event Voted();
    event RevealStarted();
    event Revealed();
    event Unlocked();
    event VoteFinished();
    event Debug(bytes32 msg);

    modifier isVoting() { require(votingSessions[currentSession].state == VotingState.Voting); _; }
  	modifier unlocked() { require(lockedSessions[msg.sender] == 0); _; }
    /* so that they can't vote twice */
    modifier notYetVoted() { require(!votingSessions[currentSession].voters[msg.sender].voted); _; }
    modifier isAdmin() { require(msg.sender == admin); _; }
    modifier isRevealing() { require(votingSessions[currentSession].state == VotingState.Revealing);_; }
    modifier notYetRevealed() { require(votingSessions[currentSession].voters[msg.sender].voted && !votingSessions[currentSession].voters[msg.sender].revealed); _; }
    modifier hasFunds(uint[] values) { require(tok.balanceOf(msg.sender) >= values[argmax(values)]); _; }
    modifier validCommitment(string secret, uint[] votes) { require(keccak256(secret,votes) == votingSessions[currentSession].voters[msg.sender].blindedVote);_; }
    modifier isFinished() { require(currentSession == 0 || votingSessions[currentSession].state == VotingState.Finished);_; }
  	/* checks if the voter is within phaseLength for phase (VOTING or REVEAL) */
    modifier validPhaseTime() { require(block.number - votingSessions[currentSession].startingPhaseTime < votingSessions[currentSession].phaseLength);_; }
    /* checks if the voter is past phaseLength to poke and change state */
    modifier isPastPhaseTime() { require(block.number - votingSessions[currentSession].startingPhaseTime >= votingSessions[currentSession].phaseLength);_; }
  	modifier checkValLength(uint[] values) { require(values.length == votingSessions[currentSession].totalVotes.length);_; }

    function VotingMechanism(address _admin, address _tokenaddr) public {
        admin = _admin;
        tok = Token(_tokenaddr);
    }

    /* Creates a new voting session with _question as question+ options and _numOptions options.
       Checks that msg.sender = admin and previous voting session is finished or is the first session. */
    function newVotingSession(string _question, uint _numOptions, uint _phaseLength) isAdmin() isFinished() public {
        /* question:  what is your favo? 1. jkfdlasjfa 2.jkldfsjds 3.fjdklsajfds */
        currentSession += 1;
        uint currBlockTime = block.number;
        votingSessions[currentSession] = VotingSession(_question,
                                                       new uint[](_numOptions),
                                                       _numOptions,
                                                       currBlockTime,
                                                       _phaseLength,
                                                       VotingState.Voting);
        VoteStarted();
    }

    /* Gets question and choices of current voting session's */
    function getQuestion() public constant returns (string) {
        return votingSessions[currentSession].question;
    }

    /* admin can poke contract to next phase voting -> reveal */
    function moveToReveal()
      isAdmin()
      isVoting()
      isPastPhaseTime()
    {
        votingSessions[currentSession].state = VotingState.Revealing;
      	votingSessions[currentSession].startingPhaseTime = block.number;
        RevealStarted();
    }

    /* admin can poke contract to next phase reveal -> finish */
    function moveToFinish() isAdmin() isRevealing() isPastPhaseTime() {
        votingSessions[currentSession].state = VotingState.Finished;
        VoteFinished();
    }

    /* create a vote takes in an input of a hashed secret key and your array of votes */
    function vote(bytes32 _vote)
  		isVoting()
        notYetVoted()
        validPhaseTime()
        unlocked()
    {
        votingSessions[currentSession].voters[msg.sender] = Vote(_vote,
                                                                 true,
                                                                 false,
                                                                 new uint[](votingSessions[currentSession].numOptions));
        lockedSessions[msg.sender] = currentSession;
        tok.lockAccount(msg.sender);
        Voted();
    }

    /* reveal real votes */
    function reveal(string secret, uint[] values)
  		  isRevealing()
        validPhaseTime()
        validCommitment(secret, values)
        notYetRevealed()
        hasFunds(values)
        checkValLength(values)
    {
        Debug(votingSessions[currentSession].voters[msg.sender].blindedVote);
        Debug(keccak256(secret,values));
        for (uint i = 0; i < votingSessions[currentSession].numOptions; i++) {
            votingSessions[currentSession].totalVotes[i] += values[i];
        }
      	votingSessions[currentSession].voters[msg.sender].values = values;
        votingSessions[currentSession].voters[msg.sender].revealed = true;
        Revealed();
    }

    /* called at any time after revealing */
    function unlock() isFinished() {
      	/* if didn't reveal, then slash all funds */
        if (!votingSessions[lockedSessions[msg.sender]].voters[msg.sender].revealed) {
            slash(msg.sender);
        } else {
            uint charge = computeCharge(msg.sender);
            //pay small interest to voters as incentive for participation
            uint balanceWithInterest = (tok.balanceOf(msg.sender)*interest) / interestFactor;
            tok.forceUpdate(msg.sender, balanceWithInterest - charge);
        }
      	/* can vote again */
      	lockedSessions[msg.sender] = 0;
        Unlocked();
    }

  	/* if winner with total votes is different than winner with (totalvotes - your votes) then your
       vote was decisive, and you should be charged the amount charged, is the margin by which the alterntive
       winner would have won by which is less than your vote for the winning value, since your vote was decisive */
  	function computeCharge(address account) returns (uint) {
    	uint numOptions = votingSessions[currentSession].numOptions;
        altResults = new uint[](numOptions);
        //Calculate result of vote without this voter, to find their externality
        for (uint i = 0; i < numOptions; i++) {
            altResults[i] = votingSessions[currentSession].totalVotes[i] - votingSessions[currentSession].voters[account].values[i];
        }
        uint realWinner = argmax(votingSessions[currentSession].totalVotes);
        uint altWinner = argmax(altResults);
        if (realWinner != altWinner) {
            return altResults[altWinner] - altResults[realWinner];
        } else {
          	return 0;
        }
    }

  	function argmax(uint[] values) returns (uint) {
        uint maxVal;
        uint idx;
        for (uint i; i < values.length; i++) {
            if (values[i] > maxVal) {
                maxVal = values[i];
                idx = i;
            }
        }
        return idx;
    }


    /* if a voter does not reveal in time, then he loses all access to his tokens */
    function slash(address account) private {
    	tok.forceUpdate(account, 0);
    }

    function getVote(address account) public returns (bytes32, uint[]) {
        return (votingSessions[currentSession].voters[msg.sender].blindedVote, votingSessions[currentSession].voters[msg.sender].values);
    }

    function sha3Helper(string secret, uint[] values) public constant returns (bytes32) {
      bytes32 result = keccak256(secret,values);
      Debug(result);
      return result;
    }

}
