
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


export const EditorStateBlockType = new GraphQLObjectType({
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


const CommentGalleryType = new GraphQLObjectType({
	name: "CommentGalleryType",
	fields: () => ({
		image: {
			type: GraphQLString,
		},
		imageFormats: imageType,
	}),
});



export const EditorStateEntityDataType = new GraphQLObjectType({
	name: "EditorStateEntityDataType",
	fields: {
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
		src: {
			type: GraphQLString,
		},
		_map: {
			type: GraphQLJSON,
		},
	},
});


export const EditorEntityDefaultType = new GraphQLObjectType({
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


export const EditorEntityGalleryType = new GraphQLObjectType({
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


export const EditorEntityLinkType = new GraphQLObjectType({
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


export const EditorEntityImageType = new GraphQLObjectType({
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


export const editorBlockTypeResolve = (data) => {

	const {
		type,
	} = data;

	// console.log("editorBlockTypeResolve data", data);

	switch(type){
		
		case "GALLERY":

			return EditorEntityGalleryType;
		
		case "LINK":

			return EditorEntityLinkType;
		
		case "IMAGE":

			return EditorEntityImageType;

			break;

		default: return EditorEntityDefaultType;
	}

}

export const EditorEntityType = new GraphQLUnionType({
	name: "EditorEntityType",
	types: [
		EditorEntityDefaultType,
		EditorEntityGalleryType,
		EditorEntityLinkType,
		EditorEntityImageType,
	],
	resolveType: editorBlockTypeResolve,
});


export const CommentEditorStateType = new GraphQLObjectType({
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

			// 	// console.log("CommentEditorStateType", source && source.entityMap);

			// 	return source && source.entityMap || null;

			// }
		},
	},
});
