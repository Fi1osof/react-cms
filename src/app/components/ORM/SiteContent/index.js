import {
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';

import { List } from 'immutable';


// import {
//   // SchemaObject,
//   // order,
//   // ModelObject,
// } from '../';

// import moment from 'moment';

// import {browserHistory} from 'react-router';

// moment.locale('ru');

// import ModelObject from '../object';

// import {
//   CommentType,
// } from '../Comment';

// import {
//   RatingType,
// } from '../Rating';

// import {
//   UserType,
// } from '../User';

// import ErrorType from '../Error';

// import {
//   // imageType,
//   // coordsType,
//   // SortField,
//   // TVsField,
//   // GalleryField,
// } from '../fields';


const SiteContentType = new GraphQLObjectType({
  name: 'SiteContentType',
  description: "Страница сайта",
  fields: () => {

    return {
      id: {
        type: GraphQLInt,
      },
      status: {
        type: GraphQLInt,
        description: "Статус ответа",
      },
      title: {
        type: GraphQLString,
        description: "Заголовок страницы",
      },
      description: {
        type: GraphQLString,
        description: "Описание",
      },
      keywords: {
        type: GraphQLString,
        description: "Ключевые слова",
      },
      robots: {
        type: GraphQLString,
        description: "follow/nofollow",
      },
      content: {
        type: GraphQLString,
        description: "Конечный HTML страницы",
      },
      state: {
        type: GraphQLJSON,
        description: "Данные состояний",
      },
      _errors: {
        type: GraphQLJSON,
        description: "Ошибки после попытки сохранения",
      },
      _isDirty: {
        type: GraphQLJSON,
        description: "Массив измененных данных",
        // resolve: source => {

        //   return source && source._isDirty || null;
        //   // return source && source._isDirty ? true : false;

        // },
      },
    }
  }
});


export const SiteContentArgs = {
  component: {
    // type: new GraphQLNonNull(GraphQLString),
    type: GraphQLString,
    description: "Исполняемый компонент",
  },
  request: {
    type: new GraphQLNonNull(GraphQLJSON),
    description: "Параметры запроса",
  },
  geo: {
    type: new GraphQLNonNull(GraphQLJSON),
    description: "Координаты",
  },
  pathname: {
    type: GraphQLString,
    description: "Запрошенный УРЛ (Для отладки)",
  },
  companyId: {
    type: GraphQLString,
    description: "Запрошенная компания (Для отладки)",
  },
  city: {
    type: GraphQLString,
    description: "Город (Для отладки)",
  },
};


export const getList = (source, args, context, info) => {


  const {
  } = args;


 

  const {
    remoteResolver,
  } = context;

  if(!remoteResolver){
    throw("remoteResolver undefined");
  }


  return new Promise(async (resolve, reject) => {

    try{

      const result = await remoteResolver(null, args, context, info);



      // if(result && result.success){

      //   resolve(result);

      // }
      // else{
      //   reject(result);
      // }

      resolve( result && List([result]) || null);

      // resolve(result);

    }
    catch(e){
      reject(e);
    }

  });

};


export default SiteContentType;
