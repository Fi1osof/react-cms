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


const Types = {
	cash: {
		value: "cash",
		description: "Наличные средства",
	},
	card: {
		value: "card",
		description: "Кредитные карты",
	},
};

const ReactCmsPaymentMethodEnumType = new GraphQLEnumType({
	name: "ReactCmsPaymentMethodEnumType",
	description: "Способ оплаты",
	values: Types,
});


const ReactCmsPaymentMethodType = new GraphQLObjectType({
	name: "ReactCmsPaymentMethodType",
	fields: {
		type: {
			type: ReactCmsPaymentMethodEnumType,
			description: ReactCmsPaymentMethodEnumType.description,
		},
		description: {
			type: GraphQLString,

      resolve: (source, args, context, info) => {






        const {
        	type,
        } = source || {};

        if(!type){
        	return null;
        }

        return Types && Types[type] && Types[type].description || undefined;

        // const {
        // 	parentType,
        // } = info;

        // const value = ReactCmsPaymentMethodEnumType._valueLookup.get(type);



        // return "cash";
      }
		},
	},
});


export default ReactCmsPaymentMethodType;
