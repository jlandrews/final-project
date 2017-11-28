import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col, Form, FormGroup, Button, FormControl,
  ControlLabel, Checkbox, Fade, Well} from 'react-bootstrap';
import ReactFileReader from 'react-file-reader';
import {superVotingContract, tokenContract, votingMechContract, accounts, web3} from './EthereumSetup';


class Admin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      totalOptions : 0,
      open: false,
      question: "",
      newQuestion: "",
      start_votation: undefined,
      new_start_votation: undefined,
      end_votation: undefined,
      new_end_votation: undefined,
      start_reveal: undefined,
      new_start_reveal: undefined,
      end_votation: undefined,
      new_end_reveal: undefined,
      options: ["CompanyA, CompanyB"]
    }
    this.addOptions = this.addOptions.bind(this);
    this.pushOption = this.pushOption.bind(this);
  }

  changeDeadline() {
    const present = new Date();
    if (Date.parse(this.state.newDeadline) > Date.parse(present)) {
      this.setState({deadline: this.state.newDeadline});
    }
    // Update frontend
  }

  pushOption(reference) {
    let newOpt = this.state.ids.slice(); //copy the array
    newOpt.push({'name': reference.text, 'shares': 0}); //execute the manipulations
    this.setState({options: newOpt}); //set the new state
    alert(this.state.options.length);
  }

  handlePollCreation() {
    const present = new Date();
    if ((Date.parse(this.state.start_votation) > Date.parse(present)) &&
    (Date.parse(this.state.end_votation) > Date.parse(this.state.start_votation)) &&
    (Date.parse(this.state.start_reveal) > Date.parse(this.state.end_votation)) &&
    (Date.parse(this.state.end_reveal) > Date.parse(this.state.start_reveal))
   ) {
      this.setState({
        question: this.state.newQuestion,
        start_votation: this.state.new_start_votation,
        start_reveal: this.state.new_start_reveal,
        end_votation: this.state.new_end_votation,
        end_reveal: this.state.new_end_reveal,
      });
      Object.keys(this.refs).forEach(index => this.pushOption(this.refs[index]))

      // push all options to the array: initialize with option.share = 0 & name
    }

  }

  handleFiles = files => {
    var reader = new window.FileReader();
    reader.onload = function(e) {
    // Use reader.result
    alert(reader.result)
    }
    reader.readAsText(files[0]);
  }

  addOptions() {
    var newOption = document.createElement('div');
    newOption.classList.add('form-group');
    var formLabel = document.createElement('label');
    formLabel.classList.add('col-sm-2');
    formLabel.classList.add('control-label');
    formLabel.innerText = 'Option';
    var divInput = document.createElement('div');
    divInput.classList.add('col-sm-10');
    var inputForm = document.createElement('input');
    inputForm.type = 'text';
    inputForm.setAttribute("id", "inputOption"+this.state.totalOptions.toString());
    inputForm.setAttribute("ref", "Option"+this.state.totalOptions.toString());
    inputForm.placeholder = 'Enter the new option name';
    inputForm.style.cssText = "width: 100%; padding: 6px 12px; height: 34px; border-radius: 4px; boder: 1px solid #ccc; box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);";
    divInput.appendChild(inputForm);
    newOption.appendChild(formLabel);
    newOption.appendChild(divInput);
    this.setState({totalOptions: this.state.totalOptions + 1});
    document.getElementById('newForm').appendChild(newOption);
  }

  render() {
    return (
      <Grid>
        <br/><br/><br/>
        <Button onClick={()=> this.setState({ open: !this.state.open })}>
          Create Poll
        </Button>
        <Fade in={this.state.open}>
          <div>
            <Well>
            <Form horizontal>
              <div id="newForm" controlId="newForm">
                <FormGroup controlId="formHorizontalQuestion">
                  <Col componentClass={ControlLabel} sm={2}>
                    Question
                  </Col>
                  <Col sm={10}>
                    <FormControl type="text" placeholder="Enter a question" />
                  </Col>
                  <Col componentClass={ControlLabel} sm={2}>
                    Blocks
                  </Col>
                  <Col sm={10}>
                    <FormControl type="text" placeholder="Number of Blocks per Stage" />
                  </Col>
                </FormGroup>
              </div>
              <FormGroup>
                <Col sm={12}>
                  <Button type="button" onClick={this.addOptions}>
                    Add Option
                  </Button>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={12}>
                  <Button type="submit" onClick={this.handlePollCreation}>
                    Create
                  </Button>
                </Col>
              </FormGroup>
            </Form>
            <br/>
            </Well>
          </div>
        </Fade>
        <Button>
          Next Stage
        </Button>

      </Grid>
    );
  }

}
export default Admin;
