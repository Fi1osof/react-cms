
import React, {Component} from 'react';

import PropTypes from 'prop-types';

import {
  buildSchema,
  graphql,
  // execute,
  // parse,
  GraphQLSchema,
  // GraphQLObjectType,
  // GraphQLInt,
  // GraphQLFloat,
  // GraphQLString,
  // GraphQLBoolean,
  // GraphQLList,
  // GraphQLNonNull,
  // GraphQLID,

  // introspectionQuery, 
  // buildClientSchema, 
  // printSchema,
} from 'graphql';

import rootResolver from 'modules/Site/components/ORM/resolver';

import RootType, {
  Mutation,
  rootDirectives,
} from 'modules/Site/components/ORM';

import defaultQuery from 'modules/Site/components/ORM/query';

export default class App extends Component{


  constructor(props){

    super(props);

    // const orm = new ORM();
    const schema = this.getSchema();

    this.state = {
      schema,
    };

    Object.assign(this.state, this.createStores());

    this.loadApiData = ::this.loadApiData;
    this.saveItem = ::this.saveItem;
    this.saveCommentItem = ::this.saveCommentItem;

    this.rootResolver = this.getRootResolver();
  }


  static childContextTypes = {
    inited: PropTypes.bool,
    document: PropTypes.object,
    user: PropTypes.object,
    schema: PropTypes.object,
    localQuery: PropTypes.func,
    remoteQuery: PropTypes.func,
    request: PropTypes.func,
    apiRequest: PropTypes.func,
    connector_url: PropTypes.string,
    userActions: PropTypes.object,
    documentActions: PropTypes.object,
  };


  getChildContext() {

    let {
      document,
      user,
      connector_url,
      userActions,
      documentActions,
    } = this.props;

    let {
      inited,
      schema,
    } = this.state;

    let context = {
      inited,
      document,
      user,
      schema,
      connector_url,
      userActions,
      documentActions,
      localQuery: ::this.localQuery,
      remoteQuery: ::this.remoteQuery,
      request: ::this.request,
      apiRequest: ::this.apiRequest,
    };

    return context;
  }


  getRootResolver(){
    return rootResolver;
  }

  getSchema(){

    return new GraphQLSchema({
      query: RootType,
      mutation: Mutation,
      directives: rootDirectives,
    });

  }

  createStores(){



  }

  async loadApiData(){

    // 

    const {
      developMode,
    } = this.state;

    const {
      document,
    } = this.props;

    let {
      apiData,
      // citiesData,
      resourceState,
    } = document;

    const {
      state: initialState,
    } = resourceState || {};

    const {
      cities,
    } = initialState || {};


    if(typeof window !== "undefined" && developMode){

      await this.remoteQuery({
        operationName: "apiData",
        variables: {
          limit: 0,
          apiDataGetCurrentUser: true,
        },
      })
      .then(r => {

        // document.apiData = apiData = r && r.object || null;
        apiData = r && r.data || null;

      });

    }

    // if(!apiData){
    //   return;
    // }

    apiData = apiData || {};

    Object.assign(apiData, {
      cities,
    });



    this.initData(apiData);


    let user; 

    let {
      user: currentUser,
    } = apiData || {};
    




    if(currentUser){
    	
      this.props.userActions.GetOwnDataSuccess(currentUser);

      user = currentUser;
    }


    this.initUser(user);

    return;
  }


  updateItem(item, data, store, silent){

    if(!item){
      console.error("Не указан объект");
      return false;
    }

    // if(!store){
    //   console.error("Не указано хранилище");
    //   return false;
    // }

    let newState = {};

    Object.assign(newState, data);

    if(!silent){
      
      let _isDirty = {};

      item._isDirty && Object.assign(_isDirty, item._isDirty);

      Object.assign(_isDirty, newState);

      newState._isDirty = _isDirty;

    }

    if(store){

      store.getDispatcher().dispatch(store.actions['UPDATE'], item, newState);

    }
    else{
      Object.assign(item, newState);
    }


    return item;
  }


  saveItem = async (store, item, connector_path, callback) => {
    

    let {
      connector_url,
      documentActions: {
        addInformerMessage,
      },
    } = this.props;

    // 

    // if(!store){

    //   console.error("Не было получено хранилище");
    //   return;
    // }

    if(
      !item
      || item._sending === true
    ){
      return;
    }

    let {
      id,
      _isDirty,
    } = item;

    if(!_isDirty){

      addInformerMessage({
        text: "Нечего сохранять",
        autohide: 4000,
      });
      return;
    }

    item._sending = true;
      
    var action = id && id > 0 ? 'update' : 'create';

    var options = options || {};

    var body = {};

    body['id'] = id;;
 

    for(var i in _isDirty){
      var value = _isDirty[i];

      if(value === undefined){
        continue;
      }

      // Пропускаем свойства-объекты
      // if(
      //   typeof value === "object" 
      //   && !Array.isArray(value)
      //   && value !== null
      // ){
      //   continue;
      // }

      // Пропускаем временные свойства
      if(/^\_/.test(i)){
        continue;
      }

      // 

      body[i] = value;
    };

    let result = await this.request(connector_path, false, `${connector_path}${action}`, body, {
      callback: (data, errors) => {
        // 
        // self.setState({items: data.object});

        let newObject = data.object || {};

        var errors = {};

        if(data.success === true){

   

          Object.assign(newObject, {
            _isDirty: undefined,
          });


          addInformerMessage({
            type: "success",
            text: data.message || "Объект успешно сохранен",
            autohide: 4000,
          });
        }
        else{

          if(data.data && data.data.length){
            data.data.map(function(error){
              var value = error.msg;
              if(value && value != ''){
                errors[error.id] = value;
              }
            });
          }

          errors.error_message = data.message;

          // addInformerMessage && 

          //   addInformerMessage({
          //     text: data.message || "Ошибка выполнения запроса",
          //     autohide: 4000,
          //   });

          // this.forceUpdate();
        }

        // newState.errors = this.state.errors || {};

        // newState.errors[item.id || 0] = errors;

        // item._errors = errors;

        callback && callback(data, errors);
        
        // if(callback){
        // }
        
        // this.forceUpdate();
    

        // item._sending = false;

        // 

        // this.forceUpdate();

        // TODO store.commit

        Object.assign(newObject, {
          _errors: errors,
          _sending: false,
        });

        if(store){

          let dispatcher = store.getDispatcher();
          
          dispatcher.dispatch(store.actions["SAVE"], item, newObject); 

        }
        else{
          
          Object.assign(item, newObject);

        }

        this.forceUpdate();
      }
    })
    .then(r => {
      return r;
    })
    .catch(e => {
      item._sending = false;
      throw(e);
    });

    // return;

    // fetch(this.props.connector_url + '?pub_action='+ connector_path + action,{
    //   credentials: 'same-origin',
    //   method: options.method || "POST",
    //   body: body,
    // })
    //   .then(function (response) {

    //     return response.json()
    //   })
    //   .then((data) => {

    //   })
    //   .catch((error) => {
    //       console.error('Request failed', error, this); 

    //       item && (item._sending = false);

    //       addInformerMessage && addInformerMessage({
    //         text: "Ошибка выполнения запроса",
    //         autohide: 4000,
    //       });
    //     }
    //   );

    this.forceUpdate();

    return result;
  }


  async saveCommentItem (item) {
    // 

    // let {
    //   CommentsStore: store,
    // } = this.state;

    // item = item && store.getState().find(n => n.id === item.id);

    if(!item){
      throw(new Error("Не был получен объект комментария"));
    }

    // let {
    //   id: itemId,
    // } = item;

    // const callback = (data, errors) => { 

    //   if(data.success && data.object){

    //     // const {
    //     //   id,
    //     //   uri,
    //     // } = data.object;

    //     // if(id !== itemId){

    //     //   // const uri = `/topics/${id}/`;
          
    //     //   browserHistory.replace(uri);
    //     // }

    //     this.reloadApiData();

    //     return;
    //   }
    // }

    let result = await this.saveItem(null, item, 'comment/');

    await this.reloadApiData();



    return result;

  }


  updateCurrentUser = (item, data, silent) => {


    // item = item && UsersStore.getState().find(n => n.id === item.id);

    // let {
    //   user: {
    //     user: item,
    //   },
    // } = this.props;

    const currentUser = this.getCurrentUser();



    if(!currentUser){
      throw(new Error("Не был получен объект пользователя 2"));
    }

    return this.updateItem(currentUser, data, null, silent);
  }


  getCurrentUser = () => {
    
    let {
      user: {
        user: currentUser,
      },
    } = this.props;

    return currentUser;

  }

  saveCurrentUser = (item) => {
    // 
    // let {
    //   user: {
    //     user: item,
    //   },
    // } = this.props;

    // let {
    //   UsersStore,
    // } = this.state;

    // item = item && UsersStore.getState().find(n => n.id === item.id);

    const currentUser = this.getCurrentUser();

    if(!currentUser){
      throw(new Error("Не был получен объект пользователя"));
    }

    // let {
    //   id: itemId,
    // } = item;

    // const callback = (data, errors) => { 

    //   if(data.success && data.object){

    //     // const {
    //     //   id,
    //     //   uri,
    //     // } = data.object;

    //     // if(id !== itemId){

    //     //   // const uri = `/topics/${id}/`;
          
    //     //   browserHistory.replace(uri);
    //     // }

    //     this.reloadApiData();

    //     return;
    //   }
    // }

    return this.saveItem(null, currentUser, 'user/own_profile/');
  }


  localQuery = (graphQLParams) => {

    const {
      schema,
    } = this.state;

    // var schema = this._getSchema();

    const rootResolver = this.getRootResolver();

    const {
      query,
      operationName,
      variables,
    } = graphQLParams;
 

    // return new Promise(resolve => resolve([{}]));

    return new Promise((resolve, reject) => {

      // class user {

      //   constructor(props){

      //     Object.assign(this, props);
      //   }

      // }

      const {
        ContactsStore,
        PlacesStore,
        PlaceContactsStore,
      } = this.state;

      graphql({
        schema,
        operationName,
        source: query || defaultQuery,
        // rootValue: {
        //   contacts: ContactsStore.getState(),
        //   places: PlacesStore.getState(),
        //   contact_places: PlaceContactsStore.getState(),
        // },
        variableValues: variables || undefined,
        // contextValue: this.getChildContext(),
        contextValue: this,
        fieldResolver: rootResolver,
      }).then((result) => {

        

        let {
          errors,
        } = result;

        if(errors && errors.length){
          let {
            message,
            ...other
          } = errors[0];

          return reject(message, {...other});
        }

        resolve(result);
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
 
    });
  }

  remoteQuery = (graphQLParams) => {

    if(typeof graphQLParams !== 'object'){
      graphQLParams = {
        query: graphQLParams,
      };
    }

    const {
      query,
      operationName,
      variables,
    } = graphQLParams;

    return new Promise((resolve, reject) => {

      this.apiRequest(null, true, 'graphql', {
        query,
        operationName,
        variables,
      },{
        callback: (data, errors) => {
 

          if(data.success){
             
            return resolve(data);
          }
          else{



            return reject(data);
          }
        },
      });

    });

  }


  request = (context, allowMultiRequest, connector_path, params, options) => {

    if(allowMultiRequest === undefined){
      allowMultiRequest = false;
    }

    if(this.state[context] === undefined){
      this.state[context] = {};
    }

    if(!allowMultiRequest && this.state[context].inRequest === true){
      return;
    }


    let {
      connector_url: default_connector_url,
      user,
    } = this.props;

    params = params || {}

    Object.assign(params, {
      token: user.token,
    });
    
    var newState = {};

    newState[context] = this.state[context];

    newState[context].inRequest = true;

    this.setState(newState);

    options = options || {};


    let {
      connector_url,
      callback: callback2,
    } = options;

    connector_url = connector_url || default_connector_url;

    let callback = (data, errors) => {

      var newState = {};

      newState[context] = this.state[context];

      newState[context].inRequest = false;
      newState[context].errors = errors; 

      this.setState(newState, () => {

        callback2 && callback2(data, errors);
      });

    }
    
    options.callback = callback;

    return this._request(connector_url, connector_path, params, options);
  }

  _request = (connector_url, connector_path, params, options) => {

    let defaultOptions = {
      showErrorMessage: true,
      callback: null,
      method: 'POST',
    };

    const {
      documentActions,
    } = this.props;

    options = options || {};

    options = Object.assign(defaultOptions, options);

    let showErrorMessage = options.showErrorMessage;
    let callback = options.callback;
    let method = options.method;

    var data = {
    };

    if(params){
      Object.assign(data, params);
    }

    return new Promise((resolve, reject) => {

      const request = fetch(connector_url +'?pub_action=' + connector_path,{
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: method,
        // body: body,
        body: JSON.stringify(data),
      })
      .then(function (response) {

        return response.json()
      })
      .then( (data) => {

        let message;

        let errors = {};

        if(data.success){
        }
        else{

          // console.error('Request result', data);

          if(data.data && data.data.length){

            data.data.map(function(error){
              if(error.msg != ''){
                errors[error.id] = error.msg;
              }
            }, this);
          }

          message = data.message || "Ошибка выполнения запроса";

          showErrorMessage && documentActions.addInformerMessage({
            text: message,
            autohide: 4000,
          });

        }

        if(callback){
          callback(data, errors);
        }
        
        this.forceUpdate();

        if(data.success){
          resolve(data);
        }
        else{
          reject({
            message,
            data, 
            errors,
          });
        }

        return;
      })
      .catch((error) => {
          console.error('Request failed', error);
          
          showErrorMessage && documentActions.addInformerMessage({
            text: "Ошибка выполнения запроса",
            autohide: 4000,
          });

          if(callback){
            callback(data, {});
          }

          reject(error);
        }
      );


      this.forceUpdate();

    });
  }
  

  apiRequest = (context, allowMultiRequest, connector_path, params, options) => {

    options = Object.assign({
      connector_url: '/api/',
    }, options || {});

    return this.request(context, allowMultiRequest, connector_path, params, options);
  }

}

