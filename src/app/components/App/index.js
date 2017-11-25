
import React, {Component} from 'react';

export default class App extends Component{


  constructor(props){

    super(props);

    this.state = {};

    Object.assign(this.state, this.createStores());

  }


  createStores(){

  	console.log("createStores");

  }

}

