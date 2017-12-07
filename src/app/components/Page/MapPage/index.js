import React, {Component} from 'react';

import PropTypes from 'prop-types';

import Page from '../'; 

import {Link} from 'react-router';

import MapView from '../../Map';


let {
	...defaultProps
} = Page.defaultProps || {};


Object.assign(defaultProps, {
	MapView,
});


export default class MapPage extends Page{


	static defaultProps = defaultProps;


	constructor(props){

		super(props);

		Object.assign(this.state, {
		});
	}

	
	componentWillMount(){

		if(typeof window !== "undefined"){

			let {
				document,
			} = this.context;

			const {
				mapData,
			} = document || {};

			mapData && Object.assign(this.state, mapData);

		}

		super.componentWillMount();

	}


	loadData(options){

		const {
			document,
		} = this.context;

		const {
			mapData,
		} = document || {};


		if(mapData && mapData.companies && mapData.companies.length){

			this.setState({
				mapData,
			});

			return null;
		}

		return super.loadData(options);
	}


	async loadServerData(provider, options = {}){



		// if(typeof window !== "undefined"){

		// 	// let {
		// 	// 	document,
		// 	// } = this.context;

		// 	// const {
		// 	// 	mapData,
		// 	// } = document || {};

		// 	// return {
		// 	// 	object: mapData,
		// 	// };

		// 	return null;

		// }

		let {
			cities: citiesNull,
			...debugOptions
		} = options;



		const {
			coords,
			page,
			limit = 0,
			// withPagination = true,
			cities,
		} = options;


		// Получаем список компаний
	  const result = await provider({
	    operationName: "MapData",
	    variables: {
	      limit: limit,
	      // withPagination: withPagination,
	      // companiesCenter: coords,
	      // page,
	    },
	  })
	  .then(r => {
	    
	  	// if(typeof this === "object"){



		  //   let {
				// 	document,
				// } = this.context || {};

				// if(r && r.data && document){
				// 	document.mapData = r.data;
				// }
	  		
	  	// }

	    return r;

	  })
	  .catch(e => {
	    throw(e);
	  });


	  if(result && result.data){

	  	let title;

	  	const city = cities && cities[0];

	  	if(city){

	  		title = city.name;

	  	}

	  	title = title || "СпортПоиск.Инфо";

	  	title = `${title} на карте`;

	  	// if(page > 1){

	  	// 	title = `${title}, страница ${page}`;

	  	// }

  		Object.assign(result.data, {
  			title,
  		});

	  }


	  return result;

	}


	clearInitialState(){



		let {
			document,
		} = this.context;

		if(document && document.resourceState){

			const {
				state,
			} = document.resourceState;

			
			const {
				companies,
			} = state || {};

			if(companies){

				document.mapData = {
					companies,
				};

			}

		}

		return super.clearInitialState();

	}


	render(){

		const {
			companies,
		} = this.state;

		const {
			MapView,
		} = this.props;

		return <MapView
			mapData={{
				companies,
			}}
		/>
	}
}

