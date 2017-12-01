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
  wifi: {
    value: "wifi",
    description: "Wi-Fi",
  },
  freeParking: {
    value: "freeParking",
    description: "Бесплатная парковка",
  },
	Parking: {
		value: "Parking",
		description: "Платная парковка",
	},
};

const ReactCmsFacilityEnumType = new GraphQLEnumType({
	name: "ReactCmsFacilityEnumType",
	description: "Удобство",
	values: Types,
});


const ReactCmsFacilityType = new GraphQLObjectType({
	name: "ReactCmsFacilityType",
	fields: {
		type: {
			type: ReactCmsFacilityEnumType,
			description: ReactCmsFacilityEnumType.description,
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

      }
		},
	},
});


export default ReactCmsFacilityType;
