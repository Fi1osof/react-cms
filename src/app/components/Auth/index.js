/**
*
* SportpoiskAuth
*
*/

import React, { Component } from "react";

import PropTypes from "prop-types";

import Auth from 'structor-templates/components/Auth';

export default class ReactCmsAuth extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    const {
      ...other
    } = this.props; // eslint-disable-line

    return (
      <Auth
        {...other}
      />
    );
  }
}