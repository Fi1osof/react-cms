import React, {Component} from 'react';
import PropTypes from 'prop-types';



import Page from '../../'; 

import View from './View';


let {
  ...defaultProps
} = Page.defaultProps;

defaultProps = Object.assign(defaultProps, {
  View,
});


let {
  ...contextTypes
} = Page.contextTypes;


contextTypes = Object.assign(contextTypes, {
});


export default class UserPage extends Page {

  static contextTypes = contextTypes;

  // static propTypes = propTypes;

  static defaultProps = defaultProps;



  loadData(){


    const {
      params,
    } = this.props;

    let {
      username,
    } = params || {};

    return super.loadData({
      username: decodeURI(username),
    });

  }


  async loadServerData(provider, options = {}){

    let result = await super.loadServerData(provider, options);

    const {
      username,
    } = options;



    if(!username){
      return null;
    }

    let userResult = await provider({
      operationName: "UserByUsername",
      variables: {
        userUsername: username,
        userGetComments: true,
        getImageFormats: true
      },
    })
    .then(r => {

      const {
        user,
      } = r.data;


      if(!user){
        return null;
      }


      return r;
    })
    .catch(e => {
      // console.error(e);
      throw(e);
    }); 


    if(userResult && userResult.data){

      const {
        user,
      } = userResult.data;

      let title = [];

      if(user){

        const {
          username,
          fullname,
        } = user;

        fullname && title.push(fullname);

        title.push(username);

        title = title.join(", ");

      }
      else{
        return null;
      }

      Object.assign(result.data, {
        pageUser: user,
        title,
      });

    }
    else{
      return null;
    }

    // console.log("User page result", result);

    return result;
    
  }



  componentDidMount(){

    this.processAction();

    super.componentDidMount && super.componentDidMount();
  }


	// componentDidUpdate(prevProps, prevState, prevContext){

	// 	console.log("componentDidUpdate prevProps", prevProps);
	// 	console.log("componentDidUpdate prevState", prevState, this.state);
	// 	console.log("componentDidUpdate new State", JSON.stringify(this.state));
	// 	console.log("componentDidUpdate prevContext", prevContext);

	// }

  
  processAction(){

    if(typeof window === "undefined"){
      return;
    }

    const {
      params: {
        action,
      },
    } = this.props;

    switch(action){

      case "activation":

        this.processActivation();

        break;

      default:;

    }


  }

  // Активация пользователя
  processActivation(){

    const {
      params: {
        action,
      },
      location,
    } = this.props;

    const {
      request,
    } = this.context;

    const {
      username,
    } = this.props;

    const {
      k: key,
    } = location.query || {};

    request("activation", false, "users/activate", {
      username,
      key,
    }, {

      callback: (data, errors) => {



        const {
          success,
          message,
        } = data;

        if(success){

          const {
            userActions,
            documentActions,
          } = this.context;

          documentActions.addInformerMessage({
            type: "success",
            text: message || "Пользователь успешно активирован",
            autohide: 5000,
          });

          browserHistory.replace(`/profile/${username}`);
          
          userActions.GetOwnData();

        }

      },

    });

  }


  render(){
  
    const {
      View,
      params,
    } = this.props;
    

    const {
      username: locationUserName,
    } = params || {};
    

    let {
      pageUser: user,
    } = this.state;

    if(!user){
      return null;
    }
    
    return <View
      key={locationUserName}
      user={user}
      params={params}
      reloadData={::this.reloadData}
    />;
  }

}
