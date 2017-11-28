import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form';
import {Button, Jumbotron } from 'react-bootstrap';
import {Grid, Row, Col, Image, Thumbnail, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import './App.css';

class Home extends React.Component {

  render() {
    return (
      <div>
        <Jumbotron className="banner">
          <Grid>
            <h1 className="title">Athena</h1>
            <p className="banner-p">Redefining corporate Governance</p>
          </Grid>
        </Jumbotron>
      </div>
    );
  }

}
export default Home;
