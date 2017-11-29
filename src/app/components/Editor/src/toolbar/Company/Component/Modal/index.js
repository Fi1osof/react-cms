
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { stopPropagation } from 'react-draft-wysiwyg/src/utils/common';

import classNames from 'classnames';

import TextField from "material-ui/TextField";
import Grid from "material-ui/Grid";

import AutoComplete from 'material-ui-components/src/AutoComplete';

export default class EditorAddCompanyModal extends Component{

	static propTypes = {
		onChange: PropTypes.func.isRequired,
	};

	
	static contextTypes = {
		coords: PropTypes.object,
		remoteQuery: PropTypes.func.isRequired,
	};


	constructor(props){

		super(props);

		this.state = {
			companies: null,
		};
	}


	componentWillMount(){
	
	}


	componentDidMount(){

		this.loadData();

	}


	async loadData(){

		const {
			remoteQuery,
			coords,
		} = this.context;

		const result = await remoteQuery({
			operationName: "Companies",
			variables: {
				limit: 0,
				getTVs: true,
				getImageFormats: true,
				companiesCenter: coords,
			},
		})
		.then(r => {

			const {
				companies,
			} = r.data;

			this.setState({
				companies,
			});

			return r;
		})
		.catch(e => {
			throw(e);
		});

		console.log("Modal result", result);

	}

	
	render(){

		const {
			companies,
			searchText,
		} = this.state;

		const {
			popupClassName,
			updateValue,
			linkTitle,
			linkTarget,
			addLink,
			translations,
			doCollapse,
			onChange,
			...other
		} = this.props;


		if(!companies || !companies.length){
			return null;
		}

		let dataSource = companies.map(company => {

    	const {
    		id,
    		name,
    		tvs,
    		imageFormats,
    	} = company;

    	const {
    		address,
    	} = tvs || {};

    	const {
    		slider_dot_thumb: thumb,
    	} = imageFormats || {};

    	let fields = [name, address];

    	let formattedName = <Grid
    		container
    		align="center"
    		gutter={0}
    		style={{
    			paddingTop: 3,
    			paddingBottom: 3,
    			flexWrap: "nowrap",
    		}}
    	>

    		{thumb && <img 
    			src={thumb} 
    			style={{
    				paddingRight: 3,
    			}}
    		/> || null}

    		<span>{fields.join(", ")}</span>
    		
    	</Grid>

    	return {
    		id,
    		name,
    		// formattedName: fields.reduce((prev, current) => [prev, ", ", current]),
    		formattedName,
    	};

    });

		const search = searchText && new RegExp(searchText, 'ui') || undefined;

		if(search){
			dataSource = dataSource.filter(n => n && search.test(n.name));
		}

		return (
      <div
        className={classNames('rdw-link-modal', popupClassName)}
        onClick={stopPropagation}
        style={{
        	width: 400,
        	height: "auto",
        }}
      >

        {/*<span className="rdw-link-modal-label">
          Текст ссылки
        </span>*/}

        <TextField
        	label="Текст ссылки"
          // className="rdw-link-modal-input"
          onChange={updateValue}
          // onBlur={updateValue}
          name="linkTitle"
          value={linkTitle || ""}
        />

        {/*<span className="rdw-link-modal-label">
          Компания
        </span>*/}

        <AutoComplete
        	label="Компания"
        	placeholder="Поиск по названию"
          onChange={event => {

          	const {
          		value,
          	} = event.target;

          	this.setState({
          		searchText: value,
          	});

          	console.log("onChange", value);

          }}
          onNewRequest={(event, value, item) => {
          	console.log("onNewRequest", event, value, item);

          	if(!linkTitle){
          		updateValue({
          			target: {
          				name: "linkTitle",
          				value: item.name,
          			}
          		});
          	}

        		updateValue({
        			target: {
        				name: "linkTarget",
        				value: item.id,
        			}
        		});


          }}
          // searchText={searchText || ""}
          // filterResults={true}
          closeOnBlur={false}
          // onBlur={updateValue}
          name="linkTarget"
          value={parseInt(linkTarget) || ""}
          dataSource={dataSource}
          {...other}
        />

        {/*<input
          className="rdw-link-modal-input"
          onChange={this.updateValue}
          onBlur={this.updateValue}
          name="linkTarget"
          value={linkTarget || ""}
        />*/}

        {/*<span className="rdw-link-modal-target-option">
          <input
            type="checkbox"
            defaultChecked={linkTargetOption === '_blank'}
            value="_blank"
            onChange={this.updateTarget}
          />
          <span>{translations['components.controls.link.linkTargetOption']}</span>
        </span>*/}

        <span className="rdw-link-modal-buttonsection">
          <button
            className="rdw-link-modal-btn"
            onClick={addLink}
            disabled={!linkTarget || !linkTitle}
          >
            {translations['generic.add']}
          </button>
          <button
            className="rdw-link-modal-btn"
            onClick={doCollapse}
          >
            {translations['generic.cancel']}
          </button>
        </span>
      </div>
    );

	}
}
