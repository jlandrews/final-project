import React, { Component } from 'react';
import {Navbar, FormGroup, Button, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
       value: ''
    }
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <div>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Search"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </div>
    );
  }
}
export default Form;
