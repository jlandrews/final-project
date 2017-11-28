import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CountdownClock from './CountdownClock';
import {Grid, Row, Col, Modal, Alert, Form, FormGroup, Button, FormControl,
  ControlLabel, Table, thead, tbody, Checkbox, Jumbotron, Collapse, Well} from 'react-bootstrap';
import './App.css';

class Vote extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openCollapse: false,
      show: false,
      totalShares: 0,
      deadline: undefined,
      newDeadline: undefined,
      options: [
        {
          'name': 'CompanyA',
          'shares': 0
        },
        {
          'name': 'CompanyB',
          'shares': 0
        }]
    }
    this.onToggle = this.onToggle.bind(this);
    this.changeOption = this.changeOption.bind(this);
    this.handleSubmitVote = this.handleSubmitVote.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  changeOption(index, newValue) {
      if (newValue > 0) {
        console.log(newValue);
        const options = this.state.options.slice();
        options[index]['shares'] = newValue;
        this.setState({
          options: options,
          totalShares: this.state.totalShares + newValue
        });
      }
  }

  changeDeadline() {
    const present = new Date();
    if (Date.parse(this.state.newDeadline) > Date.parse(present)) {
      this.setState({deadline: this.state.newDeadline});
    }
    // Update frontend
  }

  // getAccounts() {
  //   if (this.state)
  // }

  onToggle() {
  // check if checkbox is checked

    var secretInput = ReactDOM.findDOMNode(this.refs.secretInput);
    alert(secretInput.value);
    if (ReactDOM.findDOMNode(this.refs.modalCheckbox.checked)) {
      secretInput.type = 'text';
    } else {
      secretInput.type = 'password';
    }
  }

  handleSubmitVote() {
    this.setState({show: true});
    this.changeOption(0, ReactDOM.findDOMNode(this.refs.formOptions0.value));
    this.changeOption(1, ReactDOM.findDOMNode(this.refs.formOptions1.value));

  }

  refresh() {

  }

  showModal = () => {
  this.setState({
    show: true,
  })
}
// Photo by Arnaud Jaegers on Unsplash
  render() {

    let close = () => this.setState({ show: false });
    var count = 0;

    const opts = Object.keys(this.state.options).map((name, i) => (
      <Col xs={12} md={6} className="voting-options" ref={"option"+ i.toString()}>
          <h4>{this.state.options[i]['name']}</h4>
          <ControlLabel>Amount: </ControlLabel>
          <FormGroup ref={"formOptions"+ i.toString()}>
            <FormControl
              type="number"
              placeholder=" "
            />
            <FormControl.Feedback />
          </FormGroup>
      </Col>
    ))

    return (
      <div>
        <Jumbotron className="banner-vote">
        </Jumbotron>
        <Grid>
          <Grid>
            <Row className="row">
              <Col xs={12} md={12}>
                <h1>Vote</h1>
                <p>You have 30 blocks to vote</p>
              </Col>
            </Row>

            <Row>
              <input placeholder = "Your public address" ref="address"/>
            </Row>

            <Row>
              <Col xs={12} md={12}>

              </Col>
            </Row>
          </Grid>
          <hr/>
          <Grid>


            <Row className="row">
                {opts}
            </Row>
          </Grid>
          <hr/>
          <Grid>


          </Grid>
          <hr/>
          <Grid>
            <Row className="row">
              <Col xs={1} md={4}></Col>
              <Col xs={4} md={4}>
                <Button bsStyle="primary"
                      bsSize="large"
                      onClick={this.handleSubmitVote}
                      type="submit" block>
                  Submit
                </Button>
              </Col>
              <Col xs={1} md={4}></Col>
            </Row>
          </Grid>
        </Grid>
        <Modal
            show={this.state.show}
            onHide={close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Summary of your vote</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">

              <p>Balance: 100 </p>
              <br/>
              <FormGroup >
                <ControlLabel>Secret Key</ControlLabel>
                <FormControl
                  type="password"
                  label="Secret key"
                  data-toggle="password"
                  ref="secretInput"
                  placeholder="Enter your secret"
                />
                <FormControl.Feedback />
              </FormGroup>
              <Checkbox ref="modalCheckbox" onClick={this.onToggle}>
                  Show secret
              </Checkbox>

              <Alert bsStyle="warning" onDismiss={this.handleAlertDismiss}>
                <p>Save your secret securely. You will need it to reveal your vote afterwards.</p>
              </Alert>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={close} bsStyle="danger">Cancel</Button>
                <Button type="submit" bsStyle="success" onClick={this.refresh}>
                  Vote
                </Button>
            </Modal.Footer>
          </Modal>
      </div>
    );
  }

}
export default Vote;
