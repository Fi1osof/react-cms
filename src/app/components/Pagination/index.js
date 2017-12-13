

import './styles/styles.less';

import React, {Component} from 'react';

import PropTypes from 'prop-types';

import PaginationPrototype from 'react-cms-data-view/src/Pagination';

import { Link, browserHistory } from "react-router";

const paginationItemStyle = {
  cursor: 'pointer',
}

class Pagination extends PaginationPrototype{

	static contextTypes = {
    router: PropTypes.object.isRequired,
	}

	getNewLocation = (page) => {


		const {
			router,
		} = this.context;

		if(!router){
			return null;
		}

		const {
			location,
		} = router;

  	
  	let newLocation = router.createLocation(location);

  	newLocation.query.page = page > 1 ? page : undefined;

  	return router.createPath(newLocation);

	}

	render(){


    let {show, page, limit, total} = this.props;

    const classes = {

    };

    if(!show || !page || !limit || !total){
      return null;
    }
 
    let pages = Math.ceil(total/limit);

    if(pages < 2){
    	return null;
    }

    var rows = [];

    if(page > 1){
    	
    	var href = this.getNewLocation(1);

    	var href = this.getNewLocation(page - 1);

      rows.push(<li key='page-1-0' className="control">
      	<Link style={paginationItemStyle} to={href} href={href}>«</Link>
      </li>);
    }

    var lstr = false;
    var rstr = false;
    for(var i = 1; i <= pages; i++){
      if(
        (
          page > 2
          && i < page -1
          && i > 1
        )
        || (
          pages - page > 3
          && i > page +1
          && i < pages -1
        )
      ){
        if(!lstr && i > 1 && i < page){
          rows.push(<li key={i}><span>...</span></li>);
          lstr = true;
        }
        if(!rstr && i > page && i < pages){
          rows.push(<li key={i}><span>...</span></li>);
          rstr = true;
        }
      }
      else {

      	var href = this.getNewLocation(i);

        rows.push(<li key={i} className={i != page || 'active'}>
        	<Link style={paginationItemStyle} to={href} href={href}>{i}</Link>
      	</li>);
      }
    }
    if(page < pages){

      var href = this.getNewLocation(page+1);

      rows.push(<li key={'page-'+ pages +'-0'} className="control">
      	<Link style={paginationItemStyle} href={href} href={href}>»</Link>
      </li>);

    }

    return (
      <div className={classes.Pagination}>
        <ul className="pagination">
          {rows}
        </ul>
      </div>
    )
  }
}

export default class MyPagination extends Component{

	static contextTypes = {
	};

	static propTypes = {
		page: PropTypes.number.isRequired,
		limit: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired,
	};

	constructor(props){

		super(props);

		this.state = {}
	}

	componentWillMount(){

	}

	componentDidMount(){

	}

  componentDidUpdate(){
 
  }

	render(){

		let {
			...other
		} = this.props;

		return <Pagination 
			{...other}
		/>;
	}
} 
