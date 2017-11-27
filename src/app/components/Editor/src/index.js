// @flow

import './styles/styles.less';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import React, { Component } from 'react';
import type { Element } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
// import FormControl from 'material-ui/Form/FormControl';
// import FormHelperText from 'material-ui/Form/FormHelperText';

// import FormControl, {styleSheet} from 'modules/Site/components/UI/Form/FormControl';

import classNames from 'classnames';

import PropTypes from 'prop-types';

import moment from 'moment';

import Button from 'material-ui/Button';
// import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';

import { 
	Editor as EditorProto,
} from 'react-draft-wysiwyg';

import {
	Editor as DraftEditor, 
	EditorState,
	convertFromHTML,
	ContentState,
  convertToRaw, 
  convertFromRaw,
} from 'draft-js';

import {
  // changeDepth,
  // handleNewLine,
  blockRenderMap,
  getCustomStyleMap,
  // extractInlineStyle,
  // getSelectedBlocksType,
} from 'draftjs-utils';

// import customPropTypes from 'material-ui/utils/customPropTypes';

// import {stateToHTML} from 'draft-js-export-html';


export class Editor extends EditorProto{

	render() {
    const {
      editorState,
      editorFocused,
      toolbar,
    } = this.state;

    const {
      locale,
      localization: { locale: newLocale, translations },
      toolbarCustomButtons,
      toolbarOnFocus,
      toolbarClassName,
      toolbarHidden,
      editorClassName,
      wrapperClassName,
      toolbarStyle,
      editorStyle,
      wrapperStyle,
      uploadCallback,
      ariaLabel,
			readOnly,
			...other
    } = this.props;


    if(!readOnly){
    	return super.render();
    }

    // else

    return (
      <div
        id={this.wrapperId}
        className={classNames(wrapperClassName, 'rdw-editor-wrapper')}
        style={wrapperStyle}
        aria-label="rdw-wrapper"
      >
        <div
          ref={this.setWrapperReference}
          className={classNames(editorClassName, 'rdw-editor-main')}
          style={editorStyle}
          // onClick={this.focusEditor}
          // onFocus={this.onEditorFocus}
          // onBlur={this.onEditorBlur}
          // onKeyDown={KeyDownHandler.onKeyDown}
          // onMouseDown={this.onEditorMouseDown}
        >
          <DraftEditor
            ref={this.setEditorReference}
            // onTab={this.onTab}
            // onUpArrow={this.onUpDownArrow}
            // onDownArrow={this.onUpDownArrow}
            editorState={editorState}
            // onChange={this.onChange}
            // blockStyleFn={blockStyleFn}
            customStyleMap={getCustomStyleMap()}
            // handleReturn={this.handleReturn}
            // handlePastedText={this.handlePastedText}
            blockRendererFn={this.blockRendererFn}
            // handleKeyCommand={this.handleKeyCommand}
            ariaLabel={ariaLabel || 'rdw-editor'}
            blockRenderMap={blockRenderMap}
            {...this.editorProps}
          />
        </div>
      </div>
    );
  }

}




export class TextField extends Component {


  static contextTypes = {
    // styleManager: customPropTypes.muiRequired,
  };


	constructor(props){
		

		super(props);

		const {
			value,
		} = props;

		// const blocksFromHTML = convertFromHTML(value);

		// const blocksFromHTML;

		// const state = ContentState.createFromBlockArray(
		//   blocksFromHTML.contentBlocks,
		//   blocksFromHTML.entityMap
		// );


    const editorState = this.initEditState(value); 

		this.state = {
  		// editorState: EditorState.createWithContent(state),
  		editorState,
		};

	}

  initEditState(content){
    var editorState;
 

    var state = null;

    // if(content && typeof content == "string"){ 

    //   /*
    //   * Пытаемся распарсить JSON
    //   * */
    //   try{
    //     var json = JSON.parse(content);

    //     if(json){
    //       content = json;
    //     }
    //   }
    //   catch(e){

    //   }

    //   if(!content.blocks){
    //     // if(typeof window != "undefined"){
    //     // }

    //     if(typeof window != "undefined"){
    //       var blocks = convertFromHTML(content);
    //       state = ContentState.createFromBlockArray(blocks);
    //     }

    //     /*
    //       В роутере server-side прописана функция виртуализации DOM.
    //       https://github.com/facebook/draft-js/issues/586#issuecomment-300347678
    //     */
    //     else if(global.serverDOMBuilder){

    //       const blocks = convertFromHTML(content, global.serverDOMBuilder);
    //       // const blocks = global.serverDOMBuilder(content, convertFromHTML);

    //       state = ContentState.createFromBlockArray(blocks);
    //     }
    //   }
    // }

    if(!state && content && content.blocks){
      state = convertFromRaw(content);
    }
 
    if(state){
      editorState = EditorState.createWithContent(state);
    }
    else{
      editorState = EditorState.createEmpty();
    }
 


    // return EditorState.set(editorState, {decorator: decorator});


    return editorState;
  }


	onEditorChange(editorState){

		// let value = editorState && stateToHTML(editorState.getCurrentContent());

		// if(value === "<p><br></p>"){
		// 	value = "";
		// }
    

    let currentContent = editorState.getCurrentContent();
    var plainText = currentContent.getPlainText(); 


    // const value = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const value = convertToRaw(currentContent);
    // const value = "";

		const {
			onChange,
		} = this.props;

		const {
			name,
		} = this.props;

		const event = {
			target: {
				name,
				value,
			},
		};

		if(onChange){

      const plainText = currentContent.getPlainText(); 

      onChange(event, plainText);

    } 



		// onChange && onChange({
		// 	target: {
		// 		name: "plainText",
		// 		value: plainText,
		// 	},
		// });

		this.setState({
			editorState,
		});

	}


	render(){

	  const {
	    onChange,
			readOnly,
	    ...other
	  } = this.props;

		const {
			editorState,
		} = this.state;

	  return <Editor 
  		{...other}
  		editorState={editorState} 
  		onEditorStateChange={::this.onEditorChange}
			readOnly={readOnly}
			toolbarHidden={readOnly ? true : false}
			wrapperClassName={["rdw-editor-wrapper", readOnly ? "readonly" : "editable"].join(" ")}
			toolbar={{
				options: ['inline', 'list', 'textAlign', 'link', 'emoji', 'remove', 'history'],
				// fontFamily: {
				// 	options: [],
				// },
				inline: {
			    // inDropdown: false,
			    // className: undefined,
			    // component: undefined,
			    // dropdownClassName: undefined,
			    options: ['bold', 'italic', 'underline', 'strikethrough'],
			    // bold: { icon: bold, className: undefined, title: undefined },
			    // italic: { icon: italic, className: undefined, title: undefined },
			    // underline: { icon: underline, className: undefined, title: undefined },
			    // strikethrough: { icon: strikethrough, className: undefined, title: undefined },
			    // monospace: { icon: monospace, className: undefined, title: undefined },
			    // superscript: { icon: superscript, className: undefined, title: undefined },
			    // subscript: { icon: subscript, className: undefined, title: undefined },
			  },
			  link: {
			    // inDropdown: false,
			    // className: undefined,
			    // component: undefined,
			    // popupClassName: undefined,
			    // dropdownClassName: undefined,
			    showOpenOptionOnHover: readOnly ? false : true,
			    defaultTargetOption: '_blank',
			    // options: ['link', 'unlink'],
			  },
			}}
      localization={{
        locale: 'ru',
      }}
  	/>;

	}

}

TextField.defaultProps = {
  required: false,
};

export default TextField;


