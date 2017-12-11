'use strict';


import React    from 'react';
import ReactDom from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from "react-redux";

const fs = require('fs');

// import configureStore from '../../../app/store';
// import routes from "../../../app/routes";

// import {MainApp} from "modules/Site/components/App/";

var Model = require('objection').Model;
 
// import Response from './components/response';

const debug = require('debug')("react-cms:router");

import md5 from 'md5';

import fetch from 'node-fetch';

const geoip = require('geoip-lite');

const FormData = require('form-data');



// import config, {
//   db as db_config,
//   host,
//   site_url,
// } from '../../config/config'; 


// let {
//   connection: {
//     prefix,
//   },
// } = db_config;

let knex;
 
let styles = {};

 

let apiData;
let mapData;
let citiesData;


/*
  OLD Router
*/

export default class Router {

  clients = [];   // WS-соединения

  users = [];     // Активные пользователи

  constructor(options){

    // const SendMODXRequest = (action, params) => {
    //   return this.SendMODXRequest(action, params, req);
    // }

    this.inited = false;

    const {
      config,
      db_config,
      // host,
      site_url,
      configureStore,
      routes,
      MainApp,
      Response,
    } = options; 

    let {
      connection: {
        prefix,
      },
    } = db_config;

    this.configureStore = configureStore;
    this.routes = routes;
    this.MainApp = MainApp;
    this.Response = Response;
    this.site_url = site_url;
    this.prefix = prefix;

    knex = require('knex')(db_config);

    this.response = new this.Response(this, null, null, knex, config, this.clients, this.SendMessage, ::this.SendMODXRequest);


    // this.response.localQuery({
    //   operationName: "Resources",
    //   variables: {
    //     resourceExcludeTemplates: 0,
    //   },
    //   req: {},
    // })
    // .then(r => {



    //   const {
    //     resources,
    //   } = r.data;

    //   this.resources = resources;

    // })
    // .catch(e => {
    //   console.error(e);
    // });


    this.router = this.createRouter(options);


    this.init();

  }


  async init(){

    await this.loadData();

    this.setReloadDataInterval();

  }


  setReloadDataInterval(){

    setInterval(::this.reloadData, 1000 * 600);

  }


  async loadData() {



    // debug("loadData main");

    // knex.raw("SET SESSION group_concat_max_len = 10000000;").then().catch(e => {
    //   console.error("SET SESSION Error", e);
    // });

    await this.loadApiData();

    // this.loadMapData();

    await this.loadCitiesData();

    this.loadRedirects();

    this.inited = true;

    return true;
  }


  async reloadData(){
    
    // debug("reloadData");

    const result = await this.loadData();

    // debug("apiData reloaded");

    return result;

  }
  

  loadApiData(){

    return this.response.remoteQuery({
      operationName: "apiData",
      variables: {
        resourceExcludeTemplates: 0,
        getCompanyGallery: true,
        getImageFormats: false,
      },
      req: {},
    })
    .then(r => {

      apiData = r.data;

      this.response.initData(apiData);

    })
    .catch(e => {
      console.error(e);
    });

  }


  loadCitiesData(){

    // this.response.localQuery({
    //   operationName: "Cities",
    //   variables: {
    //     limit: 0,
    //     getCompanyGallery: false,
    //     // getImageFormats: true,
    //     getTVs: false,
    //   },
    //   req: {},
    // })
    // .then(r => {



    //   citiesData = r.data;

    // })
    // .catch(e => {
    //   console.error(e);
    // });

  }


  loadRedirects(){


    this.response.remoteQuery({
      operationName: "Redirects",
      variables: {
        redirectsLimit: 0,
      },
    })
    .then(r => {



      const {
        redirects,
      } = r.data;

      this.redirects = redirects;

    })
    .catch(e => {
      console.error(e);
    });

  }


  clearCache = () => {



    return this.loadData();
  }


  createRouter = (options) => {

    const {
    } = options || {};

    var express = require('express');
    let router = express.Router();


    // debug("Server started");

    var httpServ = require('http');

    require('express-ws')(options.app);



    /*
      WS
    */
   


    const SendMessageToAll = function(ws, message, original_message, exclude_current){

      let clients = this.clients;

      delete message.cookie;
      delete message.password;

      if(original_message){
        delete original_message.cookie;
        delete original_message.password;
      }

      for(var i in clients){

        var client = clients[i];

        if(exclude_current && client == ws){
          continue;
        }

        this.SendMessage(client, message, original_message);
      }
    }


    
    // setInterval(() => {

    //   let res = {};
    //   let req = {};
    //   let request = {};

    //   let response = new Response(req, res, request, knex, clients, SendMessage, config);

    //   // return response.process();

    //   response.notifyUsersUnreadMessages({
    //     headers: {},
    //   }, {}, response, {});

    // }, 1000 * 60 * 5);

    
    /*
      Cлужба рассылки уведомлений о новых письмах
    */
    // setInterval(() => {

    //   let res = {};
    //   let req = {};
    //   let request = {};

    //   let response = new Response(req, res, request, knex, clients, SendMessage, config);

    //   // return response.process();

    //   response.notifyUsersUnreadMessages({
    //     headers: {},
    //   }, {}, response, {});

    // }, 1000 * 60 * 5);



    const success = function(req, res, response, knex){
      

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(response));
    }

    const failure = function(req, res, response){


      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(response));
    }


    const processResponse = function(req, res, response){
      if(response.success){
        return success(req, res, response);
      }
      else{
        return failure(req, res, response);
      }
    }
   
   

    /*
     * Static
     * */


    /*
     * Надстройка WebSocket для роутера
     * */
    // var expressWs = require('express-ws')(options.app);


    /*
     * API
     * */
    //



    const SendUsersActivity = function(){

      let clients =this.clients;

      var users_list = [];
      var ids = {};

      var total_active_clients = 0;

      for(var i in clients){
        var client = clients[i];

        if(
          client.readyState == client.OPEN
        ){

          total_active_clients++;

          if(
            client.user
            && client.user.id
            && !ids[client.user.id]
          ){
            ids[client.user.id] = true;
            users_list.push(client.user);
          }
        }
      }


      users_list.reverse();

      // for(var i in clients){
      //   SendMessage(clients[i], {
      //     type: "active_users_list",
      //     users: users_list,
      //   });
      // }

      /*
       * Если список пользователей изменился, отправляем статистику
       * */
      if(md5(users_list) != md5(users)){
        users = users_list;

        SendMessageToAll({
          type: "active_users_list",
          users: users,
        });
      }


      // debug('SendUsersActivity');
      // debug('total_active_clients', total_active_clients);
      // debug('users', users);
      return;
    }
   

    function SendMessageToUsers(message, users_ids){

      let clients = this.clients;




      if(!users_ids || users_ids == ""){
        return;
      }

      users_ids = users_ids.split(",");

      for(var i in users_ids){
        users_ids[i] = Number(users_ids[i]);
      }

      clients.map(function(client){

        // var client = clients[i];

        // if(exclude_current && client == ws){
        //   continue;
        // }


        // break;



        if(users_ids.indexOf(client.user_id) != -1){


          this.SendMessage(client, message);
        }

        // SendMessage(client, message);
      });
    }


    function SendMessageToUsers(message, users_ids){




      let clients = this.clients;

      if(!users_ids || users_ids == ""){
        return;
      }

      users_ids = users_ids.split(",");

      for(var i in users_ids){
        users_ids[i] = Number(users_ids[i]);
      }

      clients.map(function(client){

        if(users_ids.indexOf(client.user_id) != -1){

          this.SendMessage(client, message);
        }

      });
    }

    router.ws('/api/', (ws, req) => {

      try{
        this.processWsRequest(ws, req);
      }
      catch(e){
        console.error(e);
      }

    });



    /*
    * API
    * */

    //   /*
    //   * Собираем кукисы из оригинального запроса и если передаются куки в параметрах запроса,
    //   * то объединяем их
    //   * */
    

    router.post('/api/', ::this.processPostRequest);


    router.use('/', ::this.processMainRequest);


    return router;

  };


  async processPostRequest(req, res, next){

    const startTime = new Date().getTime();

    // debug("processPostRequest");

    const request = Object.assign(req.query, req.body);


    const result = await this.response.process(req, res, request);

    const endTime = new Date().getTime();

    const diff = (endTime - startTime) / 1000;

    // debug("processPostRequest", `${diff.toFixed(3)} sec`);

  };


  processWsRequest = (ws, req) => {

    let clients = this.clients;

    // debug("Server. WS Requested");

    ws.id = md5(new Date().getTime());

    clients.push(ws);


    ws.on('message', async (message) => {

      // debug('Я получил от вас сообщение: ' + message);

      try{
        message = JSON.parse(message);
        // let response = message;

        // debug("Server. Received message", message);

        const {
          type,
        } = message;


        var result = {};

        const raw_text = message.text;
        const text = raw_text;


        switch(type){

          case 'message':

            var client_id = message.client_id;


            if(!client_id){
              result = {
                type: "error"
                ,text: "Не был указан ID клиента"
              };
            }
            else if(!text){
              result = {
                type: "error"
                ,text: "Текст не может быть пустым"
              };
            }


            else{
              result = {
                type: "message"
                ,sender: {
                  id: client_id
                  ,guest: ws.client_data.guest
                  ,name: ws.client_data.name
                  ,photo: ws.client_data.photo
                }
                ,text: text
              };
            }

            if(result.type == "error"){
              ws.send(JSON.stringify(result));
            }
            else{
              for(var i in clients){
                if(clients[i].readyState == WebSocket.OPEN){
                  clients[i].send(JSON.stringify(result));
                }
              }

              var d = new Date();
              var n = d.getTime();

              Message.query().insert({
                text: text
                ,raw_text: raw_text
                ,ts: String(n).substr(0,10) + '.' + String(n).substr(10)
                ,user_id: ws.user_id
                ,channel_id: ws.channel_id
              }).then(function (record) {

              });
            }
            break;



          case 'joined':

            ws.user_id = response.id;

            break;

          case 'coords':

            const {
              coords,
            } = message;



            ws.coords = coords;

            break;

          default:



            this.SendMessage(ws, {
              type: "error"
              ,text: "Неизвестный тип сообщения"
            }, response);
        }


      }
      catch(e){
        console.error(e);
      }

    });

    // ws.send(JSON.stringify({
    //   type: "hello"
    // }));

    ws.on('close', function(){

      // debug("Соединение закрыто");

      for(var i in clients){
        if(clients[i] === ws){
          clients.splice(i, 1);
          debug("Удален клиент из общего списка");
          break;
        }
      }

      // SendUsersActivity();
    });




    this.SendMessage(ws, {
      type: "hello"
    }, {});

  };


  async processMainRequest(req, res){

    const startTime = new Date().getTime();

    // debug("processMainRequest");
    
    if(!this.inited){

      console.error("Сервер все еще запускается");

      return res.status(503).send("Сервис запускается");
    }

    const url = req.url;

    const decodedURI = decodeURI(req.url).replace(/\@[0-9\.\,]+/, '');


    // Яндекс наиндексировал херни
    let redirectMatch;

    if(decodedURI){

      if(/.+\/bani-otzivy\/$/.test(decodedURI)){
        return res.redirect(301, '/bani-otzivy/');
      }

      // else if(/.+\/topics\/$/.test(decodedURI)){
      //   return res.redirect(301, '/topics/');
      // }
      
      
      redirectMatch = decodedURI.match(/.+(\/(topics|city|ratings)\/.*)/);

      if(redirectMatch && redirectMatch[1]){
        return res.redirect(301, redirectMatch[1]);
      }


      if(/.+\/contacts.html$/.test(decodedURI)){
        return res.redirect(301, '/contacts.html');
      }

    }


    await match({ 
      routes: this.routes, 
      location: url,
    }, async (error, redirectLocation, renderProps) => {

      const {
        redirects,
      } = this;




      const redurectUri = decodedURI.replace(/^\/+/, '');

      // const resource = this.resources && this.resources.find(n => n.uri === redurectUri);

      // if(redurectUri && !resource){

      //   const redirect = redirects && redirects.find(n => n.uri === redurectUri || `${n.uri}/` === redurectUri);

      //   if (redirect) { // Если необходимо сделать redirect

      //     const link = '/' + redirect.redirect_uri;

      //     if(decodedURI !== link){

      //       return res.redirect(301, link);
            
      //     }

      //   }
        
      // }


      if (redirectLocation) { // Если необходимо сделать redirect
        return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      }

      if (error) { // Произошла ошибка любого рода
        return res.status(500).send(error.message);
      }

      if (!renderProps) { // мы не определили путь, который бы подошел для URL

        const prefix = this.prefix;

        // if(!prevent){

          // debug("knex resreq.headers", req);

          var q = knex(`${prefix}monitor_requests`)
            .insert({
              site_url: req.hostname,
              url: req.url,
              http_status: 404,
              context_key: "web",
              parent: 0,
              path: '/www/gorodskie-bani.ru/',
              uuid: '',
              ip: '',
              time: 0,
              php_error_info: '',
              referer: '',
              user_agent: req.headers['user-agent'],
            })
            ;

            q.then((result) => { 

              // debug("knex SQL", q.toString());
              // debug("knex result", result);

            }).catch(e => {

              console.error(e);
            });

          return res.status(404).send('Not found');
        // }

      }





      let html;

      try{


        const {
          params,
          location,
          routes,
        } = renderProps;

        



        let ip = req.headers['x-real-ip'];

        if(!ip || /^127./.test(ip)){

          ip = "178.219.186.12";
          // ip = "109.184.14.163";
          
        }

        let geo = geoip.lookup(ip);

        if(!geo){
          geo = { range: [ 3000743936, 3000744959 ],
            country: 'RU',
            region: '48',
            city: 'Moscow',
            ll: [ 55.7485, 37.6184 ],
            metro: 0,
            zip: 101194,
          };
        }







        // const {
        //   1: baseRouter,
        // } = routes || [];

        // const {
        //   component: Component,
        // } = baseRouter || {};


        // let component = "MainPage";

        // if(Component){

        //   switch(Component){

        //     // Страница компаний
        //     case CompaniesPage:

        //       component = "CompaniesPage";

        //       break;

        //   }

        // }
        // else{
        //   throw("Не был получен базовый компонент");
        // }

        let resourceData = await this.response.localQuery({
          operationName: "SiteContent",
          variables: {
            request: renderProps,
            // component,
            geo,
          },
          req,
        })
        .then(r => {



          return r.data;
        })
        .catch(e => {
          console.error(e);
          throw(e);
        });


        // let {
        //   // state: __state,
        //   siteContent,
        //   ... debugState
        // } = resourceData || {};

        let {
          siteContent,
        } = resourceData || {};

        let {
          status,
          state: resourceState,
          user,
        } = siteContent || {};

        if(!siteContent){
          status = 404;
        }
        
        /*
          Если статус 404, то смотрим редиректы
        */
        if(status === 404 && redurectUri){

          const redirect = redirects && redirects.find(n => n.uri === redurectUri || `${n.uri}/` === redurectUri);

          if (redirect) { // Если необходимо сделать redirect

            const link = '/' + redirect.redirect_uri;

            if(decodedURI !== link){

              return res.redirect(301, link);
              
            }

          }
          
        }



        let {
          coords,
        } = resourceState || {};


        // Перетираем координаты, если есть/
        if(coords){
          geo.ll = [coords.lat, coords.lng];
        }



        // Запрашиваем данные для пользователя

    
        let store = this.configureStore();

        let state = store.getState();

        Object.assign(state.document, {
          // apiData,
          // mapData,
          // citiesData,
          geo,
          resourceState: siteContent || null,
        });

        Object.assign(state.user, {
          user,
        });

        store = this.configureStore(state);

        let appExports = {};

        const MainApp = this.MainApp;

        // debug("ReactDom.renderToString");

        const componentHTML = ReactDom.renderToString(
          <MainApp
            appExports={appExports}
          >
            <Provider store={store}>
              <RouterContext 
                {...renderProps} 
              />
            </Provider>
          </MainApp>
        );

        const stylesGenerated = appExports.theme && appExports.theme.sheetsToString();


        // debug("ReactDom.renderToString result");




        // let style = '<style>';
        // style += stylesGenerated;
        // style += '</style>';

        let style = '';
        style += stylesGenerated;

        // const stylesGenerated = exports.theme.sheetsToString();

        let searchable;

        if(/\/profile\/.*?\/add-topic/.test(decodedURI)){
          searchable = false;
        }

        // html = this.renderHTML(req, componentHTML, state, resource, style, searchable, appExports);
        html = this.renderHTML(req, componentHTML, state, style, searchable, appExports);

        if(status && status !== 200){
          res.status(status);
        }



      }
      catch(e){
        console.error(e);
        return res.status(500).send(e.message || e);
      };

      return res.end(html);
    });


    // const endTime = new Date().getTime();

    // const diff = (endTime - startTime) / 1000;

    // debug("processMainRequest", `${diff.toFixed(3)} sec`);

    return;
  };


  // renderHTML(req, componentHTML, initialState, resource, style, searchable, appExports) {
  renderHTML(req, componentHTML, initialState, style, searchable, appExports) {

    let assetsUrl;

    let js_src;
    let css_src;

    let inline_styles;

    let basePath = process.cwd() + "/";

    let buildPath = basePath + "build/";





    if(process.env.NODE_ENV === 'production'){

      assetsUrl = "/assets/components/modxsite/templates/v2.0/build/";

      var htmlFileName = "index.html";
      // var html = fs.readFileSync(Path.join(assetsUrl, htmlFileName), "utf8");
      var html = fs.readFileSync( `${buildPath}${htmlFileName}`, "utf8");

      let match = html.match(/<script .*?src="(.*?)"/);

      if(match){
        js_src = match[1];
      }

      let css_match = html.match(/<link [^>]*?href="([^\"]*?\.css)" rel="stylesheet"/);

      if(css_match){
        css_src = css_match[1];

        // style = `
        //   @import url('${css_src}');
        //   ${style}
        // `;



        // const css_array = css_src.split("/");

        // css_src = "";

        // var filename = `${buildPath}css/${css_array[css_array.length - 1]}`;

        // inline_styles = fs.readFileSync(filename, "utf-8");

        // inline_styles = `<style>${inline_styles}</style>`;
      }


    }
    else{
      assetsUrl = "/build/";

      js_src = `${assetsUrl}main.js`;
      css_src = `${assetsUrl}css/main.css`;
    }





    let jState = "";



    const outputState = initialState.document.outputState;

    
    const {
      resourceState,
    } = initialState.document || {};


    Object.assign(initialState.document, {
      apiData: null,
      outputState: null,
      inputState: appExports.outputState,
      // mapData: appExports.mapData || null,
      mapData: null,
      // citiesData,
      // geo,
    });

    jState = JSON.stringify(initialState);

    jState = jState.replace(/<script.*?>.*?<\/script>/g, '');

    // let {
    //   name,
    //   longtitle,
    //   description,
    //   searchable: resourceSearchable,
    // } = resource || {};


    let {
      title,
      description,
      robots,
      status,
    } = resourceState || {};

    description = description && description.replace('"', '\"') || '';

    const headerScripts = this.getHeaderScripts();

    return `
      <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title || ''}</title>
          <meta name="description" content="${description || ''}"> 
          <meta name="robots" content="${robots ? robots : "index, follow"}" />
          <link rel="shortcut icon" href="/assets/components/modxsite/templates/pivkarta/v2/favicon.ico"/>
          <base href="/" />

          ${headerScripts}
        
          ${style && `<style>${style}</style>` || ""}
          
          ${css_src ? `<link rel="stylesheet" href="${css_src}">` : ""}

          ${inline_styles || ""}

        </head>
        <body>
          <div id="root">${componentHTML}</div>
        </body>

        <script type="application/javascript">
          window.REDUX_INITIAL_STATE = ${jState};
        </script>
          
        <script type="application/javascript" src="${js_src}" async></script>

      </html>
    `;
  };

   
  SendMessage = (client, message, original_message) => {

    if(client && client.readyState === client.OPEN){




      if(typeof message !== "object"){
        message = {
          text: "message"
        };
      }

      if(!message.ts){
        message.ts = new Date().getTime();
      }

      delete message.cookie;
      delete message.password;

      if(original_message){

        delete original_message.cookie;
        delete original_message.password;

        message.original_message = original_message;
      }

      // client.send(JSON.stringify(message));
      client && typeof client.send === "function" && client.send(JSON.stringify(message));
    }

  }


  getHeaderScripts(){
    return '';
  }


  async SendMODXRequest(action, params, req){




    // return {};

    // const req = this.req;

    const method = 'POST';

    let {
      url = `/assets/components/modxsite/connectors/connector.php?pub_action=${action}`,
    } = params;

    let options = {
      // host: host,
      // port: 80,
      // path: url,
      method,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Length': Buffer.byteLength(postData)
      },
      // json: {
      //   users: users
      // }
    };

    let form;

    let {
      sort,
      ...other
    } = params;

    params = {...other};

    if(sort){

      if(Array.isArray(sort)){

        sort = sort[0];

        if(sort){

          params.sort = sort.by;
          params.dir = sort.dir || undefined;

        }

      }

    }

    if(method == 'POST' && params){

      options.body = JSON.stringify(params);
      
    }



    /*
    * Собираем кукисы из оригинального запроса и если передаются куки в параметрах запроса,
    * то объединяем их
    * */
    var cookies = [];

    let cookies_obj;

    if(req.headers && req.headers.cookie){
      let cooks = req.headers.cookie.split(";");

      cookies_obj = {};

      cooks.map(function(item){
        var match = item.match(/ *(.+?)=(.+)/);
        if(match){
          cookies_obj[match[1]] = match[2];
        }
      });
    }

    if(cookies_obj){

      for(var i in cookies_obj){
        cookies.push(i + '=' + cookies_obj[i]);
      }
    }

    if(cookies){
      options.headers.Cookie = cookies;

      // debug("options.headers", options.headers);
    }

    // debug("options.headers", options.headers);
    // debug("options", options);


    let result = await fetch(this.site_url + url, options)
    .then(function(res) {
      return res.json();
    })
    .then(function(r) {
    
      // console.log("SendMODXRequest result", r);

      return r;
    })
    .catch(e => {
      console.error(e);
    });



    if(result){
      
      if(result.success){
        result.data = result.object;
      }
      result.count = result.object && Array.isArray(result.object) ? result.object.length : result.object ? 1 : 0;
    }



    return result;
  };

}
