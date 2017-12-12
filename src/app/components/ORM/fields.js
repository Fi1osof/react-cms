import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';




export class ObjectsListType extends GraphQLObjectType{

  constructor(props){

    props = props || {};

    let {
      type,
      args,
      fields,
      ...other
    } = props;

    fields = Object.assign(fields || {}, {
      success: {
        type: GraphQLBoolean,
      },
      message: {
        type: GraphQLString,
      },
      count: {
        type: GraphQLInt,
      },
      total: {
        type: GraphQLInt,
      },
      limit: {
        type: GraphQLInt,
      },
      page: {
        type: GraphQLInt,
      },
      object: {
        type: new GraphQLList(type),
      },
    });

    Object.assign(props, {
      fields,
    });

    super(props);

  }
}


export const imageType = {
  type: new GraphQLObjectType({
    name: 'Images',
    fields: {
      original: {
        type: GraphQLString,
        resolve: (image) => {
          return image;
        },
      },
      thumb: {
        type: GraphQLString,
        resolve: (image) => {
          return `images/resized/thumb/${image}`;
        },
      },
      marker_thumb: {
        type: GraphQLString,
        resolve: (image) => {
          return `images/resized/marker_thumb/${image}`;
        },
      },
      slider_thumb: {
        type: GraphQLString,
        resolve: (image) => {
          return `images/resized/slider_thumb/${image}`;
        },
      },
      slider_dot_thumb: {
        type: GraphQLString,
        description: "Для навигации в слайдере",
        resolve: (image) => {
          return `images/resized/slider_dot_thumb/${image}`;
        },
      },
      small: {
        type: GraphQLString,
        resolve: (image) => {
          return `images/resized/small/${image}`;
        },
      },
      middle: {
        type: GraphQLString,
        resolve: (image) => {
          return `images/resized/middle/${image}`;
        },
      },
      big: {
        type: GraphQLString,
        resolve: (image) => {
          return `images/resized/big/${image}`;
        },
      },
    },
  }),
  resolve: (object) => {

    const {
      image,
    } = object;

    return image && image.replace(/^\//g, '') || null;
  },
};

export const order = {
  type: new GraphQLEnumType({
    name: "SortType",
    values: {
      asc: {
        value: 'asc',
        description: 'В прямом порядке',
      },
      desc: {
        value: 'desc',
        description: 'В обратном порядке',
      },
    },
  }),
  description: 'Порядок сортировки',
};

export const SortBy = new GraphQLInputObjectType({
  name: "SortBy",
  fields: {
    by: {
      type: new GraphQLEnumType({
        name: 'SortByValues',
        values: {
          id: {
            value: 'id',
            description: 'По ID',
          },
          rand: {
            value: 'rand()',
            description: 'В случайном порядке',
          },
        },
      }),
      description: 'Способ сортировки',
    },
    dir: order,
  },
});

export const SortField = {
  type: new GraphQLList(SortBy),
};

export const listArgs = {
  ids: {
    type: new GraphQLList(GraphQLInt),
    description: 'Список ID',
  },
  excludeIds: {
    type: new GraphQLList(GraphQLInt),
    description: 'С какими ID исключить объекты',
  },
  search: {
    type: GraphQLString,
    description: 'Поисковый запрос',
  },
  createdby: {
    type: GraphQLInt,
    description: 'Кем создан',
  },
  sort: SortField,
  limit: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'Лимит записей',
  },
  page: {
    type: GraphQLInt,
    description: 'Страница',
  },
  offset: {
    type: GraphQLInt,
    description: 'Сколько записей пропустить',
  },
  options: {
    type: GraphQLJSON,
    description: "Прочие условия",
  },
};



export class listField {

  constructor(props){

    let {
      description,
      args,
      resolve,
      ...other
    } = props;

    args = Object.assign({...listArgs}, args || {});

    Object.assign(this, {
      description,
      args,
    });

    this.type = new ObjectsListType({
      ...other,
    });

  }

  beforeCount(source, args, context, info){

    let {
      ids,
    } = args;

    if(ids && ids.length){
      source = source.filter(n => ids.indexOf(n.id) !== -1);
    }

    return source;
  }
  
}


