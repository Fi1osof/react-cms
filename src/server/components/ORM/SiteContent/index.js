

import {
  MainApp,
  MainPage,
  TopicsPage,
  NotFoundPage,
  DbPage,
  CompaniesPage,
  CompanyPage,
  OtzivyPage,
  UsersPage,
  CommentsPage,
  RatingsPage,
  ContactsPage,
  CRMPage,
  CompaniesEditsPage,
} from 'modules/Site';


var debug = require('debug')("react-cms:sitecontent");

export const getList = (object, args, context, info) => {

  const {
    localQuery,
    remoteQuery,
    req,
  } = context;

  // debug("args req.headers", req.headers);

  return new Promise( async (resolve, reject) => {
 
    try{


      // const {
      //   headers,
      // } = req || {};

      // const {
      //   cookie,
      // } = headers || {};

      const {
        request,
      } = args;


      if(!request){
        reject({
          message: "Не был получен объект запроса",
        });
      }


      const {
        location,
        params,
        routes,
      } = request;


      if(!location){
        reject({
          message: "Не был получен объект URL",
        });
      }

      const {
        1: baseRouter,
      } = routes || [];


      const {
        component: Component,
      } = baseRouter || {};


      if(!Component){
        reject("Не был получен базовый компонент");
      }
   
      let result;


      const {
        loadServerData,
      } = Component.prototype;

      if(loadServerData){

        let options = {
          params,
          location,
        };


        result = await loadServerData.call(this, localQuery, options)
        .then(r => {
          


          return r;

        })
        .catch(e => {
          reject(e);
        });

      }




      let title;

      let object = {
        status: 200,
        state: {},
      };

      if(result && result.data){

        let {
          title,
          user,
          ...state
        } = result.data || {};

        Object.assign(object.state, state);

        title && Object.assign(object, {
          title,
          user,
        });

      }
      else{

        Object.assign(object, {
          status: 404,
          title: "Страница не найдена",
          robots: "noindex,nofollow",
        });

      }





      // Подготовка конечного вывода
      let resources = [];

      object && resources.push(object);

      if(resources.length){

        result = {
          object: resources,
        };

      }




      resolve(result);

    }
    catch(e){

      reject({
        message: e.message,
        locations: e.stack,
      });

    }

  });
}