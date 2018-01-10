

import {
  // buildSchema,
  // introspectionQuery,
  // graphql,
  // GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  // GraphQLList,
  GraphQLNonNull,
  // GraphQLID,
  GraphQLEnumType,
} from 'graphql';

import { 
  DirectiveLocation, 
} from 'graphql/language/directiveLocation';

import { 
  GraphQLDirective,
} from 'graphql/type/directives';


export const ReactCmsStorageStoreType = new GraphQLEnumType({
  name: "ReactCmsStorageStoreType",
  description: "Указатель источника данных",
  values: {
    local: {
      value: "local",
      description: "Локальное хранилище",
    },
    remote: {
      value: "remote",
      description: "Удаленное хранилище",
    },
  },
});

export const storageDirective = new GraphQLDirective({
  name: 'storage',
  description: 'Указывает откуда данные должны быть получены (локально или удаленно)',
  locations: [
    DirectiveLocation.SCHEMA,
    DirectiveLocation.QUERY,
    DirectiveLocation.FIELD,
  ],
  args: {
    store: {
      type: ReactCmsStorageStoreType,
      description: 'Используемое хранилище',
    },
  },
});


