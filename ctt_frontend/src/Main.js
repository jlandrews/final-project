import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form';
import Home from './Home';
import Vote from './Vote';
import About from './About';
import Results from './Results';
import Reveal from './Reveal';
import Admin from './Admin';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import './App.css';

class Main extends React.Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} path='/' component={Home}/>
          <Route exact path='/vote' component={Vote}/>
          <Route exact path='/about' component={About}/>
          <Route exact path='/results' component={Results}/>
          <Route exact path='/reveal' component={Reveal}/>
          <Route exact path='/admin' component={Admin}/>
        </Switch>
      </Router>
    );
  }
}

// Main = withRouter(Main);
export default Main;
