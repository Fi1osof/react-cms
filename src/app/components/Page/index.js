import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';

import {Link} from 'react-router';

const defaultProps = {}

export default class Page extends Component{

	static contextTypes = {
		inited: PropTypes.bool.isRequired,
		document: PropTypes.object.isRequired,
		coords: PropTypes.object,
		appExports: PropTypes.object.isRequired,
		setPageTitle: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired,
		getCounters: PropTypes.func.isRequired,
		localQuery: PropTypes.func.isRequired,
		remoteQuery: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    triggerGoal: PropTypes.func.isRequired,
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
    } = this.context;

    const {
    	inited: prevInited,
    } = prevContext || {};


		const page = this.getPage();

		const {
			location,
		} = prevProps;

		const {
			query: prevLocationQuery,
		} = location || {};

		const {
			page: prevPage,
		} = prevLocationQuery || {};


    if(
    	(prevContext !== undefined && !prevInited && inited)
    ){
    	
    	this.onInit();

    }
    	

    if(
    	(page || prevPage) && parseInt(page) !== parseInt(prevPage)
    ){

    	this.onPageChange();

    }

  }


  onInit(){

  	this.reloadData();

  }


  onPageChange(){

  	this.reloadData();
    	
  }


  onStoreUpdated(store, payload){

  	this.reloadData();

  }


  getPage(){

		const {
			router,
		} = this.context;


		const {
			location,
		} = router;

		const {
			query,
		} = location || {};

		const {
			page,
		} = query || {};
	
		return parseInt(page) || undefined;	
  }


  setPageTitle(title){

		const {
			setPageTitle,
		} = this.context;

		title && setPageTitle(title);

  }

	
	async loadData(options = {}){

		if(typeof window === "undefined"){
			
			return;

		}

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

		return;

	}


	reloadData(options = {}){

		return this.loadData(options);

	}


	async loadServerData(provider, options = {}){

		// Для всех страниц по умолчанию
	  return {
	  	data: {},
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


	// render(childContent){

	// 	const {
	// 		getCounters,
	// 	} = this.context;

	// 	return <div
	// 		style={{
	// 			maxWidth: 1260,
	// 			width: "100%",
	// 			margin: "0 auto",
	// 			padding: "0 16px",
	// 		}}
	// 	>
			
	// 		{childContent || null}

	// 		<div
	// 			style={{
	// 				paddingTop: 30,
	// 			}}
	// 		>
	// 			{getCounters()}
	// 		</div>

	// 	</div>;
	// }


	render(childContent){

		return childContent || null;
		
	}

}