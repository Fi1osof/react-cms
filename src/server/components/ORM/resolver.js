import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import {
	ObjectsListType,
} from 'react-cms/src/app/components/ORM/fields';


const rootResolver = (source, args, context, info) => {

    let result;


    const {
      fieldName,
      operation,
      returnType,
    } = info;


    if(source){

      if(typeof source.fieldResolver === 'function'){
        

        
        result = source.fieldResolver(source, args, context, info);
      }

      else result = source[fieldName];

    }

    if(result === undefined){

      // Резолвим по типу объекта

      return new Promise( async (resolve, reject) => {



        const {
          returnType,
        } = info;

        const {
          name: returnTypeName,
        } = returnType;



        if(returnType instanceof ObjectsListType){
          
          const {
            _fields: {
              object: objectField,
            },
          } = returnType;

          if(objectField && objectField.type){

            const {
              type: objectType,
            } = objectField;

            const {
              ofType,
            } = objectType || {};
   
            await getObjectsList(ofType, source, args, context, info)
              .then(r => {
                result = r;
              })
              .catch(e => reject(e))
          }


        }

        else if(returnType instanceof GraphQLList){

          const {
            ofType,
          } = returnType;

          await getObjects(ofType, source, args, context, info)
            .then(r => {
              result = r;
            })
            .catch(e => reject(e))

        }

        else if(returnType instanceof GraphQLObjectType){

          await getObject(returnType, source, args, context, info)
            .then(r => {
              result = r;
            })
            .catch(e => reject(e))

        }

        if(operation && operation.name){



          switch(operation.name.value){

            case "clearCache":


              const {
                scope,
              } = context;

              result = await scope.clearCache();

              break;

            // Сохранение поискового запроса
            case "saveSearchStat":

              if(returnType === SearchStatType){

                result = await createSearchStat(null, args, context, info);

              }

              break;

            // Сохранение поискового запроса
            case "updateCompany":

              if(returnType === EditVersionType){



                result = createEditVersion(null, args, context, info);

              }

              break;

          }

        }

        resolve(result);

      });

    }

    return result;
}


const getObjectsList = async (ofType, source, args, context, info) => {

	let object;



  if(ofType === CompanyType){
  


    await getCompanyList(source, args, context, info)
      .then(r => {
        object = r;
      })
      .catch(e => {
        throw(e);
      });

  }

  if(ofType === ResourceType){
  


    await getResourcesList(source, args, context, info)
    	.then(r => {
    		object = r;
    	})
      .catch(e => {
        throw(e);
      });

  }

  else if(ofType === RatingType){



    await getRatingsList(source, args, context, info)
      .then(r => {
        object = r;
      })
      .catch(e => {
        throw(e);
      });

  }

  else if(ofType === UserType){



    await getUsersList(source, args, context, info)
      .then(r => {
        object = r;
      })
      .catch(e => {
        throw(e);
      });

  }

  else if(ofType === CommentType){



    await getCommentsList(source, args, context, info)
      .then(r => {
        object = r;
      })
      .catch(e => {
        throw(e);
      });

  }


  if(ofType === WsConnectionType){

    await getWsConnectionsList(source, args, context, info)
      .then(r => {

        object = r;



      })
      .catch(e => {
        throw(e);
      });
      
  }


  if(ofType === RedirectType){

    await getRedirects(source, args, context, info)
      .then(r => {

        object = r;



      })
      .catch(e => {
        throw(e);
      });
      
  }


  if(ofType === SiteContentType){

    await getSiteContentList(source, args, context, info)
      .then(r => {

        object = r;



      })
      .catch(e => {
        throw(e);
      });
      
  }


  if(ofType === EditVersionType){

    await getEditVersionList(source, args, context, info)
      .then(r => {

        object = r;



      })
      .catch(e => {
        throw(e);
      });
      
  }


  return object;
}



const getObjects = async (ofType, source, args, context, info) => {

  let result;



  await getObjectsList(ofType, source, args, context, info)
    .then(r => {
      result = r;
    });
    
  result = result && result.object;

  return result;

}

const getObject = async (ofType, source, args, context, info) => {

  let state;

  const {
    id,
    parent,
  } = args;



  await getObjects(ofType, source, args, context, info)
    .then(r => {

      state = r;
    });


  return state && state[0];
}
 

export default rootResolver;