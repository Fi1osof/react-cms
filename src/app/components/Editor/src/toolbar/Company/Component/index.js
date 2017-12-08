
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import LinkControlLayout from 'react-draft-wysiwyg/src/controls/Link/Component';
import Option from 'react-draft-wysiwyg/src/components/Option';
import { stopPropagation } from 'react-draft-wysiwyg/src/utils/common';

import classNames from 'classnames';

import CompanyIcon from "material-ui-icons/Store";

import TextField from "material-ui/TextField";

import AutoComplete from 'material-ui-components/src/AutoComplete';

import Modal from './Modal';

export default class LinkLayout extends LinkControlLayout{


	// constructor(props){

	// 	super(props);

	// };

	// static propTypes = {

	// };

	
	// static contextTypes = {

	// };

	// updateValue(event){



 //    // return event && event.target && super.updateValue(event);
 //  };

  // updateValue: Function = (event: Object): void => {
		



  //   // this.setState({
  //   //   [`${event.target.name}`]: event.target.value,
  //   // });
  // };

	onChangeCompanyField(a,b,c){



	}


  renderAddLinkModal() {
    const { config: { popupClassName }, doCollapse, translations } = this.props;
    const { linkTitle, linkTarget, linkTargetOption } = this.state;
    
    return <Modal
    	{...{
				popupClassName,
				translations,
				doCollapse,
    	}}
    	linkTitle={linkTitle}
    	linkTarget={linkTarget}
			updateValue={::this.updateValue}
			// updateValue={(event) => {



			// 	this.setState({
			// 		dsf23: "Sdgsdf",
			// 		[`${event.target.name}`]: event.target.value,
			// 	});
			// }}
			addLink={::this.addLink}
			onChange={::this.onChangeCompanyField}
    />

  }


  renderInFlatList(): Object {
    
    const {
      config: { options, link, unlink, className },
      currentState,
      expanded,
      translations,
    } = this.props;
    const { showModal } = this.state;

    return (
      <div className={classNames('rdw-link-wrapper', className)} aria-label="rdw-link-control">
        
      	<Option
          value="unordered-list-item"
          className={classNames(link.className)}
          onClick={this.signalExpandShowModal}
          aria-haspopup="true"
          aria-expanded={showModal}
          title={link.title || translations['components.controls.link.link']}
        >
          <CompanyIcon />
        </Option>

        {expanded && showModal ? this.renderAddLinkModal() : undefined}
      </div>
    );
  }

  // renderInDropDown(): Object {
  //   const {
  //     expanded,
  //     onExpandEvent,
  //     doCollapse,
  //     doExpand,
  //     onChange,
  //     config,
  //     currentState,
  //     translations,
  //   } = this.props;
  //   const { options, link, unlink, className, dropdownClassName, title } = config;
  //   const { showModal } = this.state;
  //   return (
  //     <div
  //       className="rdw-link-wrapper"
  //       aria-haspopup="true"
  //       aria-label="rdw-link-control"
  //       aria-expanded={expanded}
  //       title={title}
  //     >
  //       <Dropdown
  //         className={classNames('rdw-link-dropdown', className)}
  //         optionWrapperClassName={classNames(dropdownClassName)}
  //         onChange={onChange}
  //         expanded={expanded && !showModal}
  //         doExpand={doExpand}
  //         doCollapse={doCollapse}
  //         onExpandEvent={onExpandEvent}
  //       >
  //         <img
  //           src={getFirstIcon(config)}
  //           alt=""
  //         />
  //         {options.indexOf('link') >= 0 && <DropdownOption
  //           onClick={this.forceExpandAndShowModal}
  //           className={classNames('rdw-link-dropdownoption', link.className)}
  //           title={link.title || translations['components.controls.link.link']}
  //         >
  //           <img
  //             src={link.icon}
  //             alt=""
  //           />
  //         </DropdownOption>}
  //         {options.indexOf('unlink') >= 0 && <DropdownOption
  //           onClick={this.removeLink}
  //           disabled={!currentState.link}
  //           className={classNames('rdw-link-dropdownoption', unlink.className)}
  //           title={unlink.title || translations['components.controls.link.unlink']}
  //         >
  //           <img
  //             src={unlink.icon}
  //             alt=""
  //           />
  //         </DropdownOption>}
  //       </Dropdown>
  //       {expanded && showModal ? this.renderAddLinkModal() : undefined}
  //     </div>
  //   );
  // }

}
