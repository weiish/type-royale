import React, { Component } from "react";
import { connect } from "react-redux";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header">
        <div className="container">
          <h1 className="header__title">Type Royale</h1>
          <h2 className="header__subtitle">
            Chicken dinners for the fastest typist
          </h2>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};
export default connect(mapStateToProps)(Header);
