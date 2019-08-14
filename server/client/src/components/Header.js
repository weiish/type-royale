import React, { Component } from "react";
import { connect } from "react-redux";
import {Styles} from '../constants'

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav style={Styles.headerStyle}>
        <div>
          <h1>Type Royale</h1>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return state;
};
export default connect(mapStateToProps)(Header);
