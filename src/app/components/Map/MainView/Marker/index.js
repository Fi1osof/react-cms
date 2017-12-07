
import React, {Component} from 'react';

import PropTypes from 'prop-types';

import SimpleMarker from 'google-map-react/develop/markers/SimpleMarker';
import ClusterMarker from 'google-map-react/develop/markers/ClusterMarker';

import IconButton from 'material-ui/IconButton';
import Business from 'material-ui-icons/Business';
import Texture from 'material-ui-icons/Texture';
import EditIcon from 'material-ui-icons/ModeEdit';

import { Link } from 'react-router';

import CompanyMiniCart from './Company';

export default class Marker extends Component{

	static proTypes = {
		cluster: PropTypes.object.isRequired,
	};

	render(){



		let {
			// item,
			// geometry: {
			// 	coordinates: {
			// 		0: lat,
			// 		1: lng,
			// 	},
			// }
			cluster,
			expandAllCompanies,
			...other
		} = this.props;

		let {
			properties: {
				point_count,
				point_count_abbreviated,
				item,
				type,
				hovered,
				openEditor,
			}
		} = cluster || {}

		let marker = null;

		if(item){

			const {
				name,
				uri,
				image,
				imageFormats,
				ratingAvg,
				tvs,
				mapIcon,
				_expandedOnMap,
				_isDirty,
			} = item;

			const {
				approved,
			} = tvs || {};

			let link = `/${uri}`;

			// const {
	  //     rating,
	  //     // max_vote,
	  //     // min_vote,
	  //     // quantity,
	  //     // quantity_voters,
			// } = ratingAvg || {};





			// if(_isDirty){

			// }


			let width;

			let iconSrc;

			let iconClasses = ["map--icon"];

			hovered && iconClasses.push('hovered');

			if(approved){
				// width = hovered ? 40 : 36;
				iconClasses.push("approved");
			}
			else{
				// width = hovered ? 34 : 28;
			}

			if(mapIcon){
				iconSrc = mapIcon;
				width = hovered ? 46 : 40;
				iconClasses.push("company");
			}
			else{
				iconClasses.push("default");
			}

			let icon;

			if(iconSrc){

				icon = <img 
					src={iconSrc}
					style={{
						width: '100%',
					}}
				/>
				
			}
			else{
				
				icon = <div
					className={iconClasses.join(" ")}
					src={iconSrc}
					// style={{
					// 	width: '100%',
					// }}
				></div>

			}


			// if(type == "Contact"){
			// 	Icon = Texture;
			// }
			// else{
			// 	Icon = Business;
			// }

			let details;

			// if(hovered){
			if(_expandedOnMap || expandAllCompanies){
				// details = <div
				// 	style={{
				// 		position: 'absolute',
				// 		zIndex: 1,
				// 		bottom: 50,
				// 		boxShadow: 'rgba(0,0,0, 0.3) 0px 0px 5px 2px',
				// 		padding: 5,
				// 		background: '#fff',
				// 	}}
				// >
				// 	<div
				// 		style={{
				// 			paddingBottom: 5,
				// 			fontSize: 14,
				// 		}}
				// 	>
				// 		{name} <Stars 
				// 			value={parseFloat(rating) || 0}
				// 		/>
				// 	</div>

				// 	{imageFormats
				// 		?
				// 		<img 
				// 			src={imageFormats.marker_thumb}
				// 		/>
				// 		:
				// 		null
				// 	}
				// </div>

				details = <CompanyMiniCart 
					item={item}
					ratings={ratingAvg}
					style={{
						position: 'absolute',
						zIndex: 1,
						bottom: 50,
						boxShadow: 'rgba(0,0,0, 0.3) 0px 0px 5px 2px',
						padding: 5,
						background: '#fff',
						width: 200,
					}}
					closeHandler={expandAllCompanies ? undefined : event => {

						Object.assign(item, {
							_expandedOnMap: false,
						});

						this.forceUpdate();

					}}
				/>
			}

			marker = <div
				style={{
					width,
					// border: '1px solid blue',
					position: 'absolute',
					// left: -(width / 2),
					left: "-50%",
					bottom: 0,
					cursor: 'pointer',
				}}
			>
				<div
					style={{
						position: 'relative',
					}}
				>
					{details}
					<Link
						to={link}
						href={link}
						onClick={event => {
							event.preventDefault();
							event.stopPropagation();
						}}
					>
						{icon}
					</Link>
				</div>
			</div>;

			// marker = <div
			// 	style={{
			// 		display: 'inline-block',
			// 		border: '1px solid red',
			// 		// marginLeft: hovered && openEditor ? -20 : 0,
			// 		// paddingRight: hovered ? 40 : 0,
			// 		position: 'absolute',
			// 		// height: 20,
			// 		// width: 20,
			// 		// top: -32,
			// 		// left: -20,
			// 		// left: hovered ? -24 : -12,
			// 	}}
			// >
			// 	{icon}
			// </div>

		}
		else{

			marker = <ClusterMarker
				text={point_count_abbreviated}
				hovered={hovered ? true : false}
			></ClusterMarker>

			// marker = <SimpleMarker
			//   // style={{
			//   // 	background: '#fff',
			//   // 	display: 'inline-block',
			//   // }}
			//  ></SimpleMarker>
		}

		return marker;
	}
}