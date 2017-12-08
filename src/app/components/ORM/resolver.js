

import {
	ObjectsListType,
} from 'react-cms/src/app/components/ORM/fields';


export const objectResolver = (ofType, source, args, context, info, getResolverByType) => {



  let {
    fieldName,
    operation,
  } = info;


  // Если это не корневой вызов, сбрасываем операцию, чтобы сквозной вызов не выполнялся
  if(source){
    operation = undefined;
  }

  let result = getObject(ofType, source, args, context, info, getResolverByType);

  if(operation && operation.name){

    switch(operation.name.value){
    }

  }

  return result;

}

export const getObjectsList = (ofType, source, args, context, info, getResolverByType) => {

  let result;

  let {
    fieldName,
  } = info;



  const resolver = getResolverByType(ofType);

  if(resolver){

    return ObjectsListResolver(resolver, source, args, context, info);

  }

}

export const getObjects = (ofType, source, args, context, info, getResolverByType) => {

  let result;



  result = getObjectsList(ofType, source, args, context, info, getResolverByType)
    // .then(r => {
    //   result = r;
    // });
  

  if(result){

    
    if(result instanceof Promise){

      return new Promise((resolve, reject) => {

        result
        .then(r => {

          resolve(r && r.object);

        })
        .catch(e => {
          reject(e);
        });

      });

    }

    result = result && result.object;
    
  }


  return result;
}

export const getObject = (ofType, source, args, context, info, getResolverByType) => {

  let state;

  // const {
  //   id,
  //   parent,
  // } = args;

  state = getObjects(ofType, source, args, context, info, getResolverByType)

  if(state){



    
    if(state instanceof Promise){

      return new Promise((resolve, reject) => {

        state
        .then(r => {



          resolve(processObjectState(r, args));

        })
        .catch(e => {
          reject(e);
        });

      });

    }



    state = processObjectState(state, args);
    
  }

  return state;
}

export const processObjectState = function (state, args){

  if(state){

    const {
      id,
      parent,
    } = args;

    if(id !== undefined){
    
      state = state.filter(n => n.id === id);

    }

    if(parent !== undefined){
      
      state = state.filter(n => n.parent === parent);

    }
    
    state = state && state.get(0);

  }

  return state;
}

export const ObjectsListResolver = (resolver, object, args, context, info) => {

  if(!resolver){
    console.error("resolver is undefined", info);
    // return reject("resolver is undefined");
    throw(new Error("resolver is undefined"));
  }

  let state = resolver(object, args, context, info);

  // console.log("ObjectsListResolver result state", state);

  // if(state){
    
  //   let {
  //     ids,
  //     parent,
  //     offset,
  //     limit,
  //     sort,
  //     page,
  //   } = args; 

  //   page = page || 1;

  //   const total = state.size;

  //   state = storeResolver(state, args, context, info);

    

  //   return state && {
  //     success: true,
  //     message: '',
  //     count: state.size,
  //     total,
  //     limit,
  //     page,
  //     object: state,
  //   } || null;

  // }

  // return state;

  return ObjectsListResolverProcessResult(state, args, context, info);
}


const ObjectsListResolverProcessResult = function(state, args, context, info){

  if(state){
    
    if(state instanceof Promise){
      
      return new Promise((resolve, reject) => {

        state
        .then(r => resolve(ObjectsListResolverProcessResult(r, args, context, info)))
        .catch(e => {
          reject(e)
        });

      });

    }
    else{
      let {
        ids,
        parent,
        offset,
        limit,
        sort,
        page,
      } = args; 

      page = page || 1;

      const total = state.size;

      state = storeResolver(state, args, context, info);

      

      return state && {
        success: true,
        message: '',
        count: state.size,
        total,
        limit,
        page,
        object: state,
      } || null;
    }

  }

  return state;

}


export const storeResolver = function(state, args, context, info){

  if(state){

    if(state instanceof Promise){

      

      return new Promise((resolve, reject) => {

        state.then(r => {

          if(r){

            r = processState(r, args, context, info);

          }

          resolve(r);
        })
        .catch(e => reject(e));

      });
      
    }
    else{

      state = processState(state, args, context, info);
    }

    
  }

  return state;
}


export const processState = function(state, args, context, info){

    let {
      id,
      ids,
      excludeIds,
      parent,
      offset,
      limit,
      sort,
      page,
    } = args;

    page = page || 1;

    if(id){

      state = state.filter(n => n.id === id);

    }

    if(ids){

      state = state.filter(n => ids.indexOf(n.id) !== -1);

    }

    if(excludeIds){

      excludeIds.map(id => {

        state = state.filter(n => n.id !== id);

      })

    }

    if(parent){

      state = state.filter(n => n.parent === parent);

    }

    if(sort){

      sort.map(rule => {

        const {
          by,
          dir,
        } = rule;

        if(!by){
          return;
        }

        let sortByRules;

        switch(by){

          case 'id':

            sortByRules = n => n.id;

            break;

          case 'rand()':

            sortByRules = n => Math.random();

            break;
        }

        if(sortByRules){

          state = sortBy(state, sortByRules, dir);

        };

      });

    }

    if(offset){
      state = state.skip(offset);
    }

    if(limit){

      if(page > 1){
        state = state.skip(limit * (page - 1));
      }

      state = state.take(limit);
    }

    return state;
}

export const sortBy = function(state, by, dir){
  
  dir = dir || 'asc';

  return state.sortBy(by, (a, b) => {

    a = a && a.toLocaleUpperCase && a.toLocaleUpperCase() || a;
    b = b && b.toLocaleUpperCase && b.toLocaleUpperCase() || b;

    if(dir == 'asc'){
      if ( a > b ) return 1;
      if (a < b ) return -1;
      return 0;
    }
    else{
      if ( a < b ) return 1;
      if (a > b ) return -1;
      return 0;
    }

  });
}