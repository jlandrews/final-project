var Token = artifacts.require("Token");
var VotingMechanism = artifacts.require("VotingMechanism");
var SuperVoting = artifacts.require("SuperVoting");

var Web3 = require("web3");
var web3 = new Web3();

contract('CTTVoting', accounts => {
  var votingMech;
  var token;
  var superVoting;
  beforeEach(() => {
    return SuperVoting.new(accounts[0], {from: accounts[0]}).then(superinstance => {
      superVoting = superinstance;
      return Token.new(superVoting.address, {from: accounts[0]}).then(tokeninstance => {
        token = tokeninstance;
        superVoting.setTokenAddress(token.address, {from: accounts[0]});
        return VotingMechanism.new(accounts[0], token.address, {from: accounts[0]}).then(votinginstance => {
          votingMech = votinginstance;
          return superVoting.setVotingMech(votingMech.address, {from: accounts[0]}).then(_ => {
            return Promise.all([
              token.debugAddTokens(accounts[1], 100),
              token.debugAddTokens(accounts[2], 100),
              token.debugAddTokens(accounts[3], 100)
            ])
          });
        })
      })
    })
  });
  it("Big messy test", () => {
    return votingMech.newVotingSession("A or B", 2, 4, {from: accounts[0]}).then(_ => {
      return Promise.all([
        votingMech.sha3Helper.call("Voter 1 Secret", [40, 0]).then(h => votingMech.vote(h, {from: accounts[1]})),
        votingMech.sha3Helper.call("Voter 2 Secret", [0, 60]).then(h => votingMech.vote(h, {from: accounts[2]})),
        votingMech.sha3Helper.call("Voter 3 Secret", [30, 0]).then(h => votingMech.vote(h, {from: accounts[3]}))
      ]).then(_ => {
        console.log("moving to reveal");
        return votingMech.moveToReveal({from: accounts[0]}).then(_ => {
          console.log("moved to reveal");
          return Promise.all([
            votingMech.reveal("Voter 1 Secret", [40, 0], {from: accounts[1]}),
            votingMech.reveal("Voter 2 Secret", [0, 60], {from: accounts[2]}),
            votingMech.reveal("Voter 3 Secret", [30, 0], {from: accounts[3]})
          ]).then(_ => {
            console.log("revealed all")
            return votingMech.moveToFinish({from: accounts[0]}).then(_ => {
              return Promise.all([
                votingMech.unlock({from: accounts[1]}),
                votingMech.unlock({from: accounts[2]}),
                votingMech.unlock({from: accounts[3]})
              ]).then(_ => {
                console.log("unlocked all");
                return Promise.all([
                  token.balanceOf.call(accounts[1]),
                  token.balanceOf.call(accounts[2]),
                  token.balanceOf.call(accounts[3])
                ]).then(([bal1, bal2, bal3]) => {
                  assert.equal(Number(bal1), 71, "Voter 1 should receive 1 unit of interest and be charged 30 units");
                  assert.equal(Number(bal2), 101, "Voter 2 should receive 1 unit of interest and not be charged");
                  assert.equal(Number(bal3), 81, "Voter 3 should receive 1 unit of interest and be charged 20 units");
                })
              })
            })
          })
        })
      })

    })
  });
})
