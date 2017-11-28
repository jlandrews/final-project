pragma solidity ^0.4.15;


/* This contract is to decide which voting mechanism we are using */
import "./Token.sol";

contract SuperVoting {
    address votingMechContract;
    address admin;
    Token tok;

    modifier isAdmin() {
        require(msg.sender == admin);
    	_;
    }

    function SuperVoting(address _admin) public {
  	    admin = _admin;
    }

    function setTokenAddress(address _tokenAddr) isAdmin() public {
        tok = Token(_tokenAddr);
    }

    function setVotingMech(address _votingMechContract) isAdmin() public {
    	/* setting voting mechanism */
  		votingMechContract = _votingMechContract;

    	/* call token to update its votingmech contract */
    	tok.newVotingMechanism(votingMechContract);
    }

    function getAdmin() public returns(address) {
        return admin;
    }
}
