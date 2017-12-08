
import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLUnionType,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';


import {
  imageType,
} from 'react-cms/src/app/components/ORM/fields';





// export const editorBlockTypeResolve = (data) => {

// 	const {
// 		type,
// 	} = data;



// 	switch(type){
		
// 		case "GALLERY":

// 			return EditorEntityGalleryType;
// 			break;
		
// 		case "LINK":

// 			return EditorEntityLinkType;
// 			break;
		
// 		case "COMPANY":

// 			return EditorEntityCompanyType;
// 			break;
		
// 		case "IMAGE":

// 			return EditorEntityImageType;
// 			break;

// 		default: return EditorEntityDefaultType;
// 	}

// }

// export const EditorEntityType = new GraphQLUnionType({
// 	name: "EditorEntityType",
// 	types: [
// 		EditorEntityDefaultType,
// 		EditorEntityGalleryType,
// 		EditorEntityLinkType,
// 		EditorEntityCompanyType,
// 		EditorEntityImageType,
// 	],
// 	resolveType: editorBlockTypeResolve,
// });


// export const CommentEditorStateType = new GraphQLObjectType({
// 	name: "CommentEditorStateType",
// 	description: "Состояние редактора",
// 	fields: {
// 		blocks: {
// 			type: new GraphQLList(EditorStateBlockType),
// 		},
// 		entityMap: {
// 			// type: new GraphQLList(EditorEntityGalleryType),
// 			type: new GraphQLList(EditorEntityType),
// 			// type: EditorEntityType,
// 			// resolve: source => {



// 			// 	return source && source.entityMap || null;

// 			// }
// 		},
// 	},
// });


export default function EditorStateBuilder(customTypes: Array, typesResolver, customFields){




	const CommentGalleryType = new GraphQLObjectType({
		name: "CommentGalleryType",
		fields: () => ({
			image: {
				type: GraphQLString,
			},
			imageFormats: imageType,
		}),
	});



	let EditorStateEntityDataTypeFields = {
		gallery: {
			type: new GraphQLList(CommentGalleryType),
		},
		target: {
			type: GraphQLString,
		},
		title: {
			type: GraphQLString,
		},
		url: {
			type: GraphQLString,
		},
		company_id: {
			type: GraphQLInt,
			description: "ID компании",
		},
		src: {
			type: GraphQLString,
		},
		_map: {
			type: GraphQLJSON,
		},
	};

	// if(customFields){
	// 	Object.assign(EditorStateEntityDataTypeFields.fields, customFields);
	// }


	const EditorStateEntityDataType = new GraphQLObjectType({
		name: "EditorStateEntityDataType",
		fields: () => {

			if(customFields){

				if(typeof customFields === "function"){
					customFields = customFields();


					Object.assign(EditorStateEntityDataTypeFields, customFields);

				}



			}




			return EditorStateEntityDataTypeFields;

		},
	});



	const EditorStateBlockType = new GraphQLObjectType({
		name: "EditorStateBlockType",
		description: "Контентный блок",
		fields: {
			data: {
				type: GraphQLJSON,
			},
			depth: {
				type: GraphQLInt,
			},
			entityRanges: {
				type: GraphQLJSON,
			},
			inlineStyleRanges: {
				type: GraphQLJSON,
			},
			key: {
				type: GraphQLString,
			},
			text: {
				type: GraphQLString,
			},
			type: {
				type: GraphQLString,
			},
		},
	});


	// export const EditorStateEntityDataType = new GraphQLObjectType({
	// 	name: "EditorStateEntityDataType",
	// 	fields: {
	// 		gallery: {
	// 			type: new GraphQLList(CommentGalleryType),
	// 		},
	// 		target: {
	// 			type: GraphQLString,
	// 		},
	// 		title: {
	// 			type: GraphQLString,
	// 		},
	// 		url: {
	// 			type: GraphQLString,
	// 		},
	// 		company_id: {
	// 			type: GraphQLInt,
	// 			description: "ID компании",
	// 		},
	// 		src: {
	// 			type: GraphQLString,
	// 		},
	// 		_map: {
	// 			type: GraphQLJSON,
	// 		},
	// 	},
	// });


	const EditorEntityDefaultType = new GraphQLObjectType({
		name: "EditorEntityDefaultType",
		fields: {
			// data: {
			// 	type: GraphQLJSON,
			// },
			data: {
				type: EditorStateEntityDataType,
			},
			mutability: {
				type: GraphQLJSON,
			},
			type: {
				type: GraphQLJSON,
			},
		},
	});


	const EditorEntityGalleryType = new GraphQLObjectType({
		name: "EditorEntityGalleryType",
		description: "Галерея",
		fields: {
			mutability: {
				type: GraphQLJSON,
			},
			type: {
				type: GraphQLJSON,
			},
			data: {
				type: EditorStateEntityDataType,
			},
			// data: {
			// 	type: new GraphQLObjectType({
			// 		name: "GalleryImage",
			// 		fields: {
			// 			gallery: {
			// 				type: GraphQLJSON,
			// 			},
			// 		},
			// 	}),
			// },
		},
	});


	const EditorEntityLinkType = new GraphQLObjectType({
		name: "EditorEntityLinkType",
		description: "Ссылка",
		fields: {
			mutability: {
				type: GraphQLJSON,
			},
			type: {
				type: GraphQLJSON,
			},
			data: {
				type: EditorStateEntityDataType,
			},
		},
	});



	const EditorEntityCompanyType = new GraphQLObjectType({
		name: "EditorEntityCompanyType",
		description: "Компания",
		fields: {
			mutability: {
				type: GraphQLJSON,
			},
			type: {
				type: GraphQLJSON,
			},
			data: {
				type: EditorStateEntityDataType,
			},
		},
	});


	const EditorEntityImageType = new GraphQLObjectType({
		name: "EditorEntityImageType",
		description: "Картинка",
		fields: {
			mutability: {
				type: GraphQLJSON,
			},
			type: {
				type: GraphQLJSON,
			},
			data: {
				type: EditorStateEntityDataType,
			},
		},
	});


	const editorBlockTypeResolve = (data) => {

		const {
			type,
		} = data;



		const returnType = typesResolver && typesResolver(data);

		if(returnType){
			return returnType;
		}

		switch(type){
			
			case "GALLERY":

				return EditorEntityGalleryType;
				break;
			
			case "LINK":

				return EditorEntityLinkType;
				break;
			
			case "COMPANY":

				return EditorEntityCompanyType;
				break;
			
			case "IMAGE":

				return EditorEntityImageType;
				break;

			default: return EditorEntityDefaultType;
		}

	}

	let types = [
		EditorEntityDefaultType,
		EditorEntityGalleryType,
		EditorEntityLinkType,
		EditorEntityCompanyType,
		EditorEntityImageType,
	];

	if(customTypes){
		customTypes.map(type => {
			types.push(type);
		})
	}

	const EditorEntityType = new GraphQLUnionType({
		name: "EditorEntityType",
		types: types,
		resolveType: editorBlockTypeResolve,
	});

	return new GraphQLObjectType({
		name: "CommentEditorStateType",
		description: "Состояние редактора",
		fields: {
			blocks: {
				type: new GraphQLList(EditorStateBlockType),
			},
			entityMap: {
				// type: new GraphQLList(EditorEntityGalleryType),
				type: new GraphQLList(EditorEntityType),
				// type: EditorEntityType,
				// resolve: source => {



				// 	return source && source.entityMap || null;

				// }
			},
		},
	});

}
