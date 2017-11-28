import React, { Component } from 'react';
import PropTypes from 'prop-types';

const MenuButton = (props) => (
  <div className="menuIcon">
    <div className="dashTop"></div>
    <div className="dashBottom"></div>
    <div className="circle"></div>
  </div>
)

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVisible: false
    }
  }

  // toggle visibility when run on the state
  showSearch() {
    this.setState({
      searchVisible: !this.state.searchVisible
    })
  }

  render() {
    // Classes to add to the <input /> element
    let searchInputClasses = ["searchInput"];

    // Update the class array if the state is visible
    if (this.state.searchVisible) {
      searchInputClasses.push("active");
    }

    return (
      <div className="header">
        <MenuButton />

        <span className="title">
          {this.props.title}
        </span>

        <input
          type="text"
          className={searchInputClasses.join(' ')}
          placeholder="Search ..." />

        {/* Adding an onClick handler to call the showSearch button */}
        <div
          onClick={this.showSearch.bind(this)}
          className="fa fa-search searchIcon"></div>
      </div>
    );
  }
}

Header.propTypes = {
  title: React.PropTypes.string
}

Header.defaultProps = {
title: 'Github activity'
}
export default Header;
