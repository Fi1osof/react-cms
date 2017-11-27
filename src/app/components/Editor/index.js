// @flow

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Editor from './src';

export default class ReactCmsEditor extends Component {


  static contextTypes = {
  };


	constructor(props){

		super(props);

		this.state = {
		};

	}


	render(){

	  const {
	    ...other
	  } = this.props;

	  return <Editor 
  		{...other}
  	/>;

	}

}

