import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Navb from './Navb';
import Footer from './Footer';
import Main from './Main';
import Home from './Home';
import {Link, Route, BrowserRouter as Router, Handler, withRouter} from 'react-router-dom';
import './App.css';

import {superVotingContract, tokenContract, votingMechContract, accounts, web3} from './EthereumSetup';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: web3,
      votingMechContract: votingMechContract,
      superVotingContract: superVotingContract,
      tokenContract: tokenContract,
      accounts: accounts
    }
  }
  componentWillMount() {
    //example function
    //pollsterContract.newPoll(this.refs.question.value.toString(), array, parseInt(this.refs.numPolls.value, 10), {from: account, gas: 4000000, value:   web3.toWei(parseFloat(this.refs.reward.value, 10), 'ether')})
    console.log(this.state.tokenContract.balanceOf(this.state.accounts[1], {from: this.state.accounts[0]}));
  }

  render() {

    return (
      <div className="App">
        <div> {this.state.accounts[1]} </div>
        <Navb/>
        <Main/>
        <Footer/>
      </div>
    );
  }
}

export default App;
