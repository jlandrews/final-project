import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Grid, Row, Col, Table, Form, FormControl, Button, thead, tbody, Jumbotron} from 'react-bootstrap';
import './App.css';

class Results extends React.Component {
  // Photo by Edwin Andrade on Unsplash

  constructor(props) {
    super(props);
    this.state = {
      secret: '',
      newSecret: ''
    }
  }

  submitSecret() {
    this.setState({secret: this.state.newSecret})
  }


  render() {
    return (
      <div>
        <Jumbotron className="banner-reveal">
        </Jumbotron>
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              <h2>Reveal your vote</h2>
              <br/>
              <p>Enter your secret key to reveal the vote you submitted.</p>
            </Col>
          </Row>
        </Grid>
        <hr/>
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              <Form>
                <FormControl
                  className="input-reveal"
                  placeholder="Public Address"
                  type="password"
                  onChange={event => this.setState({newSecret: event.target.value})}
                >
                </FormControl>
                <FormControl
                  className="input-reveal"
                  placeholder="Secret Key"
                  type="password"
                  onChange={event => this.setState({newSecret: event.target.value})}
                >
                </FormControl>
                <Button onClick={() => this.submitSecret()}>Reveal</Button>
              </Form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}
export default Results;
