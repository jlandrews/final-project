import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Home from './Home';
import {Link, Route, BrowserRouter as Router, withRouter} from 'react-router-dom';
import {web3, tokenContract, accounts} from './EthereumSetup';
import './App.css';

class Navb extends React.Component {

  render() {
    // var addr_balance = tokenContract.balanceOf()
    return (
        <Router>
          <Navbar inverse collapseOnSelect fixedTop className="navbar">
            <Navbar.Header className="nav">
                <Navbar.Brand className="nav">
                  <a href="/">Athena</a>
                </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse className="nav">
              <Nav className="nav">
                <LinkContainer to='/about'>
                  <NavItem eventKey={1} href='/about' >About Us</NavItem>
                </LinkContainer>
                <LinkContainer to='/vote'>
                  <NavItem eventKey={2} href='/vote' >Vote</NavItem>
                </LinkContainer>
                <LinkContainer to='/reveal'>
                  <NavItem eventKey={3} href='/reveal' >Reveal</NavItem>
                </LinkContainer>
                <LinkContainer to='/results'>
                  <NavItem eventKey={4} href='/results'>Results</NavItem>
                </LinkContainer>
              </Nav>
              <Nav pullRight className="nav">
                <NavItem href="#">Balance:  ETH</NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Router>
    );
  }
}

export default Navb;
