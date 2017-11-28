import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col, Table, Form, FormControl, Button, thead, tbody, Jumbotron} from 'react-bootstrap';
import './App.css';

class Results extends React.Component {
  // Photo by Edwin Andrade on Unsplash

  constructor(props) {
    super(props);
    this.state = {
      totalShares :0,
      options: ["CompanyA", "CompanyB"],
      balance: "",
      address: ""
    },
    this.getBalance = this.getBalance.bind(this);
    this.setAccount = this.setAccount.bind(this);
  }

  submitSecret() {
    this.setState({secret: this.state.newSecret})
  }

  setAccount() {
    this.setState({address: this.refs.address.value})
  }

  getBalance() {
    var accountBalances = {"0x8d7921b29d1537dab8237a84eb1898721f3ef761": 71, "0x61c272fa0adfa911d6f0d08ce2078e91f02a8108": 101, "0x7f6182771e7b32f4982663e9aaaaf163297ac279": 81 }
    var account = this.state.address;
    var newBalance = -1
    if (account in accountBalances) {
      newBalance = accountBalances[account]
    }
    this.setState({balance: newBalance})
  }


  render() {
    return (
      <div>
        <Jumbotron className="banner-results">
        </Jumbotron>
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              <h2>Results</h2>
              <br/>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Total Shares</th>
                  <th>Final Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.options[0]}</td>
                  <td>70</td>
                  <td>Selected</td>
                </tr>
                <tr>
                  <td>{this.state.options[1]}</td>
                  <td>60</td>
                  <td>Not Selected</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Grid>

        <Grid>
          <hr/>
          <Row>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Your Account</th>
                  <th>New Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input ref="address" onChange={this.setAccount}/> <button onClick={this.getBalance}> Unlock Your Account </button> </td>
                  <td>{this.state.balance}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Grid>

      </div>
    );
  }

}
export default Results;
