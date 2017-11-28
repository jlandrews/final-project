var SuperVoting = artifacts.require("./SuperVoting.sol");
var Token = artifacts.require("./Token.sol");
var VotingMechanism = artifacts.require("./VotingMechanism.sol");

module.exports = function(deployer, networks, accounts) {
  deployer.deploy(SuperVoting, accounts[0]).then(function() {
    deployer.deploy(Token, SuperVoting.address).then(function() {
      deployer.deploy(VotingMechanism, accounts[0], Token.address).then(function() {
        var sv;
        deployer.then(function() {
          return SuperVoting.deployed();
        }).then(function(instance) {
          sv = instance;
          sv.setTokenAddress(Token.address);
          sv.setVotingMech(VotingMechanism.address);
        });
      });
    });
  });
};
