import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';

import {browserHistory} from 'react-router';

const defaultProps = {}

export default class Page extends Component{

	static contextTypes = {
		inited: PropTypes.bool.isRequired,
		document: PropTypes.object.isRequired,
		// appExports: PropTypes.object.isRequired,
		user: PropTypes.object.isRequired,
		localQuery: PropTypes.func.isRequired,
		remoteQuery: PropTypes.func.isRequired,
	};

	constructor(props){

		super(props);

		this.state = {};
	}

	componentWillMount(){

		this.onWillMount();

		this.setPageTitle();

	}

	onWillMount(){

		const {
			document,
		} = this.context;

		const {
			resourceState,
		} = document;

		if(resourceState){

			// Object.assign(this.state, resourceState);

			const {
				state: initialState,
			} = resourceState;


			this.initState(initialState, true);

		}
		else {

			this.loadData();

		}

	}


	componentWillUnmount(){

		this.mounted = false;

		const {
		} = this.context;

	}


	componentDidMount(){

		this.mounted = true;

		this.clearInitialState();

	}


	// Удаляем инит-данные, чтобы при смене страницы и компонента было понятно, что данные надо подгрузить
	clearInitialState(){

		let {
			document,
		} = this.context;

		if(document){

			document.resourceState = null;

		}

	}


  componentDidUpdate(prevProps, prevState, prevContext){

    const {
    	inited,
			location: contLocation,
			user: {
				user: currentUser,
			},
    } = this.context;

    const {
    	inited: prevInited,
    	location: prevContLocation,
			user: {
				user: prevUser,
			},
    } = prevContext || {};

    if(
    	(prevContext !== undefined && !prevInited && inited)
    ){
    	
    	this.onInit();

    }


		if((currentUser || prevUser) && currentUser !== prevUser){
			this.onUserChanged();
		}


    const {
      location,
    } = this.props;

    const {
      location: prevLocation,
    } = prevProps;

    if(location && prevLocation && location !== prevLocation){

    	this.onLocationChanged();
    }

  }


  onInit(){

  	this.reloadData();

  }


  onPageChange(){

  	this.reloadData();
    	
  }


  async onLocationChanged(){


  	this.setState({
  		pageReloading: true,
  	});

  	await this.reloadData();
    
  	this.setState({
  		pageReloading: false,
  	});

  }


  onUserChanged(){

  	return this.reloadData();

  }


  onStoreUpdated(store, payload){

  	this.reloadData();

  }


  getPage(){
  	
		const {
			location,
		} = this.props;

		const {
			query,
		} = location || {};

		const {
			page,
		} = query || {};
	
		return parseInt(page) || undefined;	
  }




  setPageTitle(title){

    if(
      title
      && typeof window !== "undefined"
      && (window.document.title != title)
    ){
      window.document.title = title;
    }

    return title;

	}
	

	prepareOptions(options){

		const {
      params,
      location,
		} = this.props;
		
		// const {
		// 	query,
		// } = location || {};
		
		// const {
		// 	page,
		// } = query || {};


		// const {
		// 	user,
		// } = this.context;


		Object.assign(options, {
			params,
			location,
			// query,
			// page: page && parseInt(page) || undefined,
			// user,
		});

		return options;

	}

	
	async loadData(options = {}){

		if(typeof window === "undefined"){
			
			return;

		}

		options = this.prepareOptions(options);

		const {
			remoteQuery,
		} = this.context;

		let {
			provider,
		} = options;

		provider = provider || remoteQuery;

		let result = await this.loadServerData(provider, options);

		// if(result){

		// 	this.initState(result.data);

		// }

		this.initState(result && result.data || {});

		return result;

	}


	reloadData(options = {}){

		return this.loadData(options);

	}


	async loadServerData(provider, options = {}){

		// Для всех страниц по умолчанию
	  return {
	  	data: {
	  		title: "React-CMS",
	  	},
	  };

	}


	initState(newState, willMount){

		if(!willMount && (this.mounted !== undefined && this.mounted !== true)){
			return;
		}

		newState = newState || {};

		if(willMount){

			Object.assign(this.state, newState);
			
		}
		else{

			this.setState(newState);

		}

	}


	// Clean pagination
	cleanUriFilters = () => {

		const {
			router,
		} = this.props;

		if(!router){
			return null;
		}

		const {
			location,
    } = router;
    
    const {
      page,
    } = location.query || {}

    if(page && page > 1){
  
      let newLocation = router.createLocation(location);
  
      newLocation.query.page = undefined;
  
      const newPath = router.createPath(newLocation);

      browserHistory.push(newPath);

		}
		
	}


	render(childContent){

		return childContent || null;
		
	}

}