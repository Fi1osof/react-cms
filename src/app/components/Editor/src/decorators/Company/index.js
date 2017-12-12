import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import openlink from '../../../images/openlink.svg';
// import './styles.css';

import {
  Link,
} from 'react-router';

import Grid from 'material-ui/Grid';

import Paper from 'material-ui/Paper';


export class CompanyLinkDecorator extends Component {

  static contextTypes = {
    CompanyCart: PropTypes.func.isRequired,
  };

  static propTypes = {
    entityKey: PropTypes.string.isRequired,
    children: PropTypes.array,
    contentState: PropTypes.object,
  };

  state: Object = {
    showPopOver: false,
  };

  openLink: Function = () => {
    const { entityKey, contentState } = this.props;
    const { company_id } = contentState.getEntity(entityKey).getData();
    const linkTab = window.open(company_id, 'blank'); // eslint-disable-line no-undef
    linkTab.focus();
  };

  toggleShowPopOver: Function = () => {
    const showPopOver = !this.state.showPopOver;
    this.setState({
      showPopOver,
    });
  };

  render() {
    const { 
      children, 
      entityKey, 
      contentState,
    } = this.props;

    const {
      expanded,
    } = this.state;

    const { 
      company_id, 
      targetOption,
      Company,
    } = contentState.getEntity(entityKey).getData();

    const { showPopOver } = this.state;



    
    const {
      id,
      uri,
      name,
      longtitle,
      imageFormats,
    } = Company || {};


    const {
      slider_dot_thumb,
    } = imageFormats || {};

    return (
      <span
        className="rdw-link-decorator-wrapper"
        // onMouseEnter={this.toggleShowPopOver}
        // onMouseLeave={this.toggleShowPopOver}
      >
        <Link
          to={`/${uri}`}
          href={`/${uri}`}
          title={longtitle || name}
          target={targetOption}
          onClick={event => {

            event.stopPropagation();
            event.preventDefault();

            this.setState({
              expanded: !expanded,
            });

          }}
        >
          {slider_dot_thumb && <img src={slider_dot_thumb} style={{
            paddingLeft: 2,
            paddingRight: 2,
          }}/>}
          {children}
        </Link>

        {expanded && Company && <Grid
          container
          gutter={0}
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          
          <Grid
            item
          >
            <Paper>
              <CompanyCart
                key={id}
                item={Company}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              />
            </Paper> 
          </Grid>

          <Grid
            item
            xs
          >
            
          </Grid>

        </Grid> || null}

        {/*showPopOver && showOpenOptionOnHover ?
          <img
            src={openlink}
            alt=""
            onClick={this.openLink}
            className="rdw-link-decorator-icon"
          />
          : undefined
        */}
      </span>
    );


    // return (
    //   <span
    //     className="rdw-link-decorator-wrapper"
    //     onMouseEnter={this.toggleShowPopOver}
    //     onMouseLeave={this.toggleShowPopOver}
    //   >
    //     <a href={company_id} target={targetOption}>{children}</a>
    //     {showPopOver && showOpenOptionOnHover ?
    //       <img
    //         src={openlink}
    //         alt=""
    //         onClick={this.openLink}
    //         className="rdw-link-decorator-icon"
    //       />
    //       : undefined
    //     }
    //   </span>
    // );
  }
};

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'COMPANY'
      );
    },
    callback,
  );
}

function getLinkComponent(config) {
  const showOpenOptionOnHover = config.showOpenOptionOnHover;

  return class CompanyLinkDecorator;

}

export default config => ({
  strategy: findLinkEntities,
  component: getLinkComponent(config),
});