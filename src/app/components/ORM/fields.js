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
