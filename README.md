#Athena

Getting shareholders involved in corporate decisions has always been a problem that didn’t have a clear solution. According to CNN, “Just 27% of shareholders bother to vote.” They don’t feel that they can make an impact with the voting power that they have. That’s where Athena comes in. Athena implements a voting scheme (CTT Voting) where shareholders can vote according to their true preferences, based on the amount of shares they own.  It also rewards those who participate with interest. This mechanism is socially optimal because it picks the outcome that benefits everyone the most, and incentivizes honest reporting of each voter’s preferences. The Athena platform also has functionality to allow businesses, Decentralized Autonomous Organizations (DAOs), and other governing organizations to use alternate voting mechanisms if CTT Voting doesn’t work for them.

**Super Voting Contract:**:
- This contract will have the power to control which voting mechanism that we are using, and control the token.  
- This is so that the token will not only be linked to one type of voting mechanism
  - Ex. CTT vs standard democratic vote
- This will use multisig to be able to set the address of the new voting protocol
- setAddress(votingMech address)

**Voting Mechanism Contract (CTT):**
- Admin address allowed to dictate phase changes
  - Would likely be a multisig contract
- Phase 1: submit blinded votes (implemented as an array of integers), and lock that voter’s account
  - Submit amount of shares based on how much you want the outcome
  - Blinded through commitment scheme (voters submit a secret to be hashed with)
- Phase 2: have voters reveal votes (by submitting their secret key, and their vote)
  - With each reveal, sum of votes for each option is accumulated
  - If you don’t reveal, then you lose all shares
- Phase 3: voters accounts unlock and get charged or rewarded, and do execution function
  - Add interest, then charge fee based on the difference they make
    - A vote was held between optionA and optionB, receiving 70 votes and 60 votes respectively. If Alice staked 40 shares, she will be charged the difference her vote made. In this case if she didn’t vote, optionB would have won by 30 votes, thus Alice is charged 30 shares. If a shareholder’s vote doesn’t make a difference in the outcome, they are not charged.
  - Burn tokens that voters spend by taking them from the addresses.
  - In the case of a tie, winner is chosen randomly
- Phase 1 and 2 have a timeout
- Happening alongside all of this: can exchange tokens with other shareholders

**Voting options:**
- Vote for a certain outcome by paying for it. Get a “reward” by giving interest
- Vote Null (vote without paying).
  - Doesn’t care about the outcome. Also receive interest
- Don’t Vote
  - No payout
  - Don’t receive interest

**CTT components**
- ERC20 token
- Phases
  - Nonvoting (acts as erc20 contract with token transfers)
    - propose(actions)
      - Admin only by default
      - Could allow dynamic set of proposers
  - Voting (transfers locked, only action is to commit to a vote)
    - Vote (commitment)
    - One vote per account
  - Revealing
    - Reveal(secret, vote_array)
      - Accumulates values of vote_array into respective vote totals
      - Slash account for invalid reveal
        - Hash(secret||vote_array) != commitment
        - Or max(vote_array) > balances[msg.sender]
  - Clearing
    - Clear()
      - Calculates if my vote was decisive, and if so, charges me the difference in outcomes before my vote is applied
  - Execution
    - Need some mechanism to declare the process totally completed, and execute the winning action, presumably by a call.value
  - Give interest/inflation for voting, indirectly charges non-voters
  - Execution mechanism
    - Proposals as contract to be called / value to be transferred

**Additional features**
- Import tool for voter shares like integrating with csv at the beginning


**Frontend**
- **Admin:**
  - Decide Voting mechanism (multisig)
  - Create voting poll
  - Set time period of phases
  - Poke contract to end voting phase (as long as its past set time)

- **Shareholder:**
  - Heres your vote
  - Form to submit votes
    - display each option and have voter input preference under each, and check balance to verify valid vote
    - Unable to submit an invalid vote from the client
    - Submit secret key / have them save their key that we generated for them
  - Clock - how much time is left in the vote
  - Unlock account

**Tendermint/Ethermint**
- One of the main issues of this voting system is its vulnerability to Sybil attacks.
  - A shareholder could distribute her shares among many accounts, making sure no individual account makes a difference in the outcome.
  - If we take the example above, if Alice were to split her 40 shares between 8 accounts, none of the accounts individually would make a difference in the outcome of the vote, and thus she wouldn’t be charged for her stake.
    - This completely destroys the incentive of the voting mechanism.
    - Without the incentives, we cannot assume honest reporting of values, and thus cannot conclude the outcomes are optimal.
- Fortunately, this issue can be averted by using a Tendermint/Ethermint’s private blockchain.
  - Which can restrict write access making sure that only verified shareholders can vote and hold tokens.
