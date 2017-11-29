
import React, {Component} from 'react';

export default class App extends Component{


  constructor(props){

    super(props);

    this.state = {};

    Object.assign(this.state, this.createStores());

    this.loadApiData = ::this.loadApiData;
    this.saveItem = ::this.saveItem;
    this.saveCommentItem = ::this.saveCommentItem;
  }


  createStores(){

  	// console.log("createStores");

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
    

    // console.log("apiData", apiData);


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

    // console.log("saveCommentItem result", result);

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

    // console.log("currentUser", currentUser);

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


}

