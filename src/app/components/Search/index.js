import React, {Component} from 'react';

import PropTypes from 'prop-types';

// import AutoComplete from 'material-ui-components/src/AutoComplete';
// import YandexAutoCompletePrototype from 'material-ui-components/src/YandexAutoComplete';
import {
	YaAutoComplete,
} from 'material-ui-components/src/YandexAutoComplete';

import Grid from 'material-ui/Grid';



// import { YMaps, Map, Placemark, SearchControl } from 'react-yandex-maps';

import { YMaps} from 'react-yandex-maps';
 

const yaContext = Object.assign({
	localQuery: PropTypes.func.isRequired,
	remoteQuery: PropTypes.func.isRequired,
}, YaAutoComplete.contextTypes || {});

// class YandexAutoComplete extends YandexAutoCompletePrototype{
class YandexAutoCompleteInner extends YaAutoComplete{

	static contextTypes = yaContext;

	// static contextTypes = {
	// 	localQuery: PropTypes.func.isRequired,
	// };

	// loadData(){



	// 	// return super.loadData && super.loadData();
	//  } 


  async loadData(){



    const {
    	includeSiteData,
    } = this.props;

    const {
    	localQuery,
    	remoteQuery,
    } = this.context;


    let {
      searchText,
    } = this.state;

    let {
    	ymaps,
    } = this.props;

    if (!ymaps || !searchText.length) {
      return false;
    }
    
		let dataSource = [];

		if(searchText && searchText.length > 2){

	 		await ymaps.geocode(searchText)
	 		.then(
	 			res => {



	 				res.geoObjects.each(geoObject => {


	 					let {
	 						name,
	 						text,
	 						description,
	 						metaDataProperty: {
	 							GeocoderMetaData,
	 						},
	 						geometry,
	 						...other
	 					} = geoObject.properties.getAll();

	 					let {
	 						geometry: {
	 							_coordinates: coordinates,
	 						},
	 					} = geoObject;





	 					dataSource.push({
	 						id: GeocoderMetaData.id,
	 						name: name,
	 						formattedName: text,
	 						coordinates,
	 					});
	 				});

	 			}
	 		);


	 		if(includeSiteData){

		 		await localQuery({
		 			operationName: "Search",
		 			variables: {
		 				searchQuery: searchText,
		 				getImageFormats: true,
		 			},
		 		})
		 		.then(r => {

		 			const {
		 				search,
		 			} = r.data;

		 			if(search && search.length){

			 			search.map(n => {

			 				const {
			 					id,
			 					name,
			 					coords,
			 					imageFormats,
			 				} = n;

			 				if(!coords){
			 					return;
			 				}

			 				const {
			 					thumb: image,
			 				} = imageFormats || {};

			 				// const image = gallery && gallery[0];

			 				// return;

			 				dataSource.unshift({
								id: id,
								name: name,
								formattedName: <Grid
									key={id}
									container
									align="center"
									gutter={0}
									style={{
										flexWrap: "nowrap",
									}}
								>

									{image && <Grid
										item
									>
										<img 
											src={image}
											style={{
												height: 40,
												width: 40,
												borderRadius: "50%",
												marginRight: 5,
											}}
										/>	
									</Grid>
									 || ""}

									<Grid
										item
										style={{
											fontSize: "16px",
										}}
									>
										{name}
									</Grid>
								</Grid>,
								coordinates: [coords.lat, coords.lng],
								zoom: 17,
							});

			 			});

		 			};

		 			// Сохраняем статистику поиска
		 			remoteQuery({
		 				operationName: "saveSearchStat",
		 				variables: {
		 					searchQuery: searchText,
		 					searchFinded: search && search.length || 0,
		 				},
		 			})
		 			.then(r => {

		 			})
		 			.catch(e => {
		 				console.error("saveSearchStat error", e);
		 			});




		 		})
		 		.catch(e => {
		 			console.error(e);
		 		});

	 		}
			
		}

		
		this.setState({dataSource});

		return;
  }



  cleanupProps(props){

		let {
			includeSiteData,
			...other
		} = props;

		return other;
	}


	componentWillUpdate(nextProps, nextState){



		return super.componentWillUpdate ? super.componentWillUpdate(nextProps, nextState) : true;
	}

	// componentDidUpdate(prevProps, prevState){

	// }
}

const defaultProps = {}



class YandexAutoComplete extends Component{

	cleanupProps(props){

		let {
			...other
		} = props;

		return other;
	}

	render(){

		let props = this.cleanupProps(this.props);



		return <YMaps
			children={function(ymaps){
				return <YandexAutoCompleteInner 
					ymaps={ymaps}
					// map={map}
					// google={google}
					// onChange={event => {

					// }}
					// onUpdateInput={event => {

					// }}
					{...props}
					// onNewRequest={(event, value, item) => {


				 //  	let {
				 //  		coordinates,
				 //  	} = item;



				 //  	map.setCenter(new google.maps.LatLng(coordinates[0],coordinates[1]));
					// }}
				/>
			}}
		>
	  </YMaps>;
	}
}

 
export default class YandexSearch extends Component{

	constructor(props){

		super(props);

		this.state = {}
	}

	// componentWillMount(){

	// }

	// componentDidMount(){

	// }

 //  componentDidUpdate(){

 //    if(this.props.debug){

 //    }
 //  }

	render(){

		let {
			map,
			maps,
			// google,
			onNewRequest,
			includeSiteData,
			...other
		} = this.props;

		return <YandexAutoComplete
			includeSiteData={includeSiteData}
			// closeOnBlur={false}
			map={map}
			maps={maps}
			// google={google}
			onNewRequest={(event, value, item) => {
		  	let {
		  		coordinates,
		  		zoom,
		  	} = item;

		  	// map.setCenter(new google.maps.LatLng(coordinates[0],coordinates[1]));
		  	map.setCenter(new maps.LatLng(coordinates[0],coordinates[1]));

	  		map.setZoom(zoom || 12);

		  	onNewRequest && onNewRequest(event, value, item);
			}}
			{...other}
		/>
	}
}

YandexSearch.defaultProps = defaultProps;

YandexSearch.propTypes = {
	map: PropTypes.object.isRequired,
	maps: PropTypes.object.isRequired,
	// google: PropTypes.object.isRequired,
}
