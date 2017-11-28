/*
Implements ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20
Has modifications
.*/

pragma solidity ^0.4.15;

import "./TokenInterface.sol";

contract Token is TokenInterface {

    mapping (address => uint256) balances;
  	mapping (address => bool) lockedAccounts;
    mapping (address => mapping (address => uint256)) allowed;
    uint256 public totalSupply;

  	address votingMechContract;
  	address superVotingContract;

  	modifier notLocked(address account) {
        require(!lockedAccounts[account]);
      	_;
    }
  	modifier isVotingMech() {
        require(msg.sender == votingMechContract);
      	_;
    }
  	modifier isSuperVoting() {
        require(msg.sender == superVotingContract);
      	_;
    }

    modifier isDebug() {
      require(true);
      _;
    }

  	function Token(address _superVotingContract) public{
        superVotingContract = _superVotingContract;
    }

    function transfer(address _to, uint256 _value) notLocked(msg.sender) public returns (bool success) {
        //Default assumes totalSupply can't be over max (2^256 - 1).
        //If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check if it doesn't wrap.
        //Replace the if with this one instead.
        //if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }

    function transferFrom(address _from, address _to, uint256 _value) notLocked(_from) public returns (bool success) {
        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        //if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
            balances[_to] += _value;
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            Transfer(_from, _to, _value);
            return true;
        } else { return false; }
    }

    function balanceOf(address _owner) constant public returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant public returns (uint256 remaining) {
      	return allowed[_owner][_spender];
    }

  	/* sets new voting mechanism */
  	function newVotingMechanism(address _votingMechContract) isSuperVoting() public {
        votingMechContract = _votingMechContract;
    }
  	/* locks account for address */
  	function lockAccount(address account) isVotingMech() public {
        lockedAccounts[account] = true;
    }
  	/* unlocks account for address, call after everyone has revealed ans has been charged */
  	function unlockAccount(address account, uint256 newBalance) isVotingMech() public {
      	forceUpdate(account, newBalance);
    	lockedAccounts[account] = false;
    }
  	/* unlocks account for address, call after everyone has revealed ans has been charged */
  	function forceUpdate(address account, uint256 newBalance) isVotingMech() public {
      	/* update total supply after force update */
      	totalSupply = totalSupply + newBalance - balances[account];
      	balances[account] = newBalance;
    }

    function debugAddTokens(address account, uint amount) isDebug() {
      balances[account] = amount;
    }

    function getVotingMech() public returns(address) {
        return votingMechContract;
    }

    function lockedStatus(address account) public returns(bool) {
        return lockedAccounts[account];
    }
}
