

// import {
//   MainApp,
//   MainPage,
//   TopicsPage,
//   NotFoundPage,
//   DbPage,
//   CompaniesPage,
//   CompanyPage,
//   OtzivyPage,
//   UsersPage,
//   CommentsPage,
//   RatingsPage,
//   ContactsPage,
//   CRMPage,
//   CompaniesEditsPage,
// } from 'modules/Site';


export const getList = (object, args, context, info) => {

  const {
    SendMODXRequest,
    localQuery,
  } = context;


  console.log("SiteContent args", args);

  return new Promise( async (resolve, reject) => {

    /*
      Для начала нам надо определить географические координаты контента.
      Очередность определения такая:
      1. Явные координаты в адресной строке.
      2. Заведение (берутся его координаты).
      3. Город.
      4. Объект geo.

      Если координаты есть еще до запроса города, то получаем список городов сразу с учетом города.
      Иначе получаем объект города и только потом запрашиваем список всех городов с учетом удаленности.
    */


    const {
      request,
      // component,
      geo,
      pathname: debugPathname,
      companyId: debugCompanyId,
      city: debugCity,
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



    let {
      pathname,
      query,
    } = location;

    pathname = pathname || debugPathname;

    if(!pathname){
      reject("Не был получен УРЛ");
    }


    const {
      page,
    } = query || {};

    const relativePathname = decodeURI(pathname.replace(/^\/+/, ''));


    let object;
    

    let contentCoords;  // Координаты, от которых будет плясать контент


    let lat, lng, city;

    let {
      companyId,
      city: paramsCity,
      lat: paramsLat,
      lng: paramsLng,
      zoom: paramsZoom,
      tag: paramsTag,
      commentId: paramsCommentId,
      username: paramsUsername,
    } = params;

    paramsLat = paramsLat && parseFloat(paramsLat) || undefined;
    paramsLng = paramsLng && parseFloat(paramsLng) || undefined;
    paramsZoom = paramsZoom && parseInt(paramsZoom) || undefined;
    paramsCity = paramsCity && decodeURI(paramsCity) || undefined;
    paramsTag = paramsTag && decodeURI(paramsTag) || undefined;
    paramsCommentId = paramsCommentId && parseInt(paramsCommentId) || undefined;
    paramsUsername = paramsUsername && decodeURI(paramsUsername) || undefined;


    companyId = companyId || debugCompanyId;

    // Основные координаты взяты из адресной строки
    if(paramsLat && paramsLng){

      lat = paramsLat;
      lng = paramsLng;

      contentCoords = {
        lat,
        lng,
      }

    }

    // Координаты не определены, получаем компанию, если запрошена
    if(!contentCoords){


      // Если заход на карточку компании, то выставляем сразу город
      if(companyId){

        const result = await localQuery({
          operationName: "CompanyByUri",
          variables: {
            resourceUri: relativePathname,
          },
        })
        .then(r => {
          

          return r;

        })
        .catch(e => {
          reject(e);
        });

        // resolve(result && result.data);

        const {
          company,
        } = result && result.data || {};

        if(company){

          const {
            id,
            name,
            coords: companyCoords,
          } = company;

          if(companyCoords){

            contentCoords = companyCoords;

          }

        }

      }

    }

    // Координаты не получены. Получаем город, если он запрошен
    if(!contentCoords){

      // Если запрошена страница города и нет координат в УРЛ,
      // получаем данные города

      let requestedCity;

      if(paramsCity){

        await localQuery({
          operationName: "Cities",
          variables: {
            resourcesLimit: 1,
            resourceAlias: paramsCity,
          },
        })
        .then(r => {

          const {
            resources,
            // resources,
          } = r.data;




          requestedCity = resources && resources[0];

        })
        .catch(e => {

          console.error(e);
          
          reject(e);

        });

      }

      if(requestedCity && requestedCity.coords){

        contentCoords = requestedCity.coords;

      }

    }


    // Координаты не получены. Получаем ближайший город на основании системных геоданных
    if(!contentCoords){

      if(!geo){
        reject("Не были получены geo-данные");
      }


      let {
        0: geoLat,
        1: geoLng,
      } = geo.ll || {};
      
      lat = geoLat;
      lng = geoLng;


      if(lat && lng){
        contentCoords = {
          lat,
          lng,
        };
      }

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


    let coords = contentCoords;


    if(!coords){
      reject("Не были получены координаты");
    }


    let cities;

    await localQuery({
      operationName: "MainMenuData",
      variables: {
        limit: 0,
        resourcesCenter: coords,
      },
    })
    .then(r => {

      const {
        ratings,
        resources,
        // resources,
      } = r.data;

      cities = resources;

    })
    .catch(e => {

      console.error(e);
      
      reject(e);

    });




    // Если запрошена страница города и нет координат в УРЛ,
    // получаем данные города
    let requestedCity = paramsCity && cities && cities.find(n => n.alias === paramsCity);


    if(requestedCity && requestedCity.coords){

      if(!paramsLat || !paramsLng){

        coords = requestedCity.coords;

      }


      await localQuery({
        operationName: "MainMenuData",
        variables: {
          limit: 0,
          resourcesCenter: coords,
          menuGetRatings: false,
        },
      })
      .then(r => {

        const {
          resources,
        } = r.data;

        cities = resources;

      })
      .catch(e => {
        
        console.error(e);

        reject(e);

      });

    }


    let result;

    const {
      loadServerData,
    } = Component.prototype;

    if(loadServerData){

      let options = {
        page,
        coords,
        cities,
        pathname: relativePathname,
        tag: paramsTag,
        commentId: paramsCommentId,
        username: paramsUsername,
      };
        

      result = await loadServerData.call(this, localQuery, options)
      .then(r => {

        return r;

      })
      .catch(e => {
        reject(e);
      });

    }

    if(result && result.data){

      let {
        title,
      } = result.data || {};

      object = {
        // id,
        status: 200,
        title: title || "Городские бани",
        state: Object.assign(result.data, {cities, coords}),
      };

    }
    else{

      object = {
        // id,
        status: 404,
        title: "Страница не найдена",
        robots: "noindex,nofollow",
      };

    }


    let resources = [];

    object && resources.push(object);

    if(resources.length){

      result = {
        object: resources,
      };

    }


    resolve(result);

  });
}