import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import classNames from 'classnames';
// import Option from '../../components/Option';
import styles from './styles.less'; // eslint-disable-line no-unused-vars
 

import Button from 'material-ui/Button';
import Crop from 'material-ui-icons/Crop';

import Grid from 'material-ui/Grid';

// import * as DraftEditor from '../../components/Editor';
// import { Editor as DraftEditor} from 'react-cms-draft-wysiwyg/js/src/components/';
// import Editor from 'react-cms-draft-wysiwyg/js/src/components/Editor';
import { Editor as DraftEditor} from 'react-draft-wysiwyg';

// import Draft from 'draft-js';
// var {EditorState, convertToRaw, convertFromRaw} = Draft;


import ImageControl from '../../toolbar/Image';
import ImageRenderer from '../Image';
import Cropper from '../Image/Cropper';

// import {Editor as DraftEditor} from 'draft-js';

// const ColumnsRenderer = (config) => class Columns extends Component { 
export default class ColumnsRenderer extends Component { 

  state: Object = {
    hovered: false,
    cropperOpened: false,
  };

  constructor(props){

    super(props);

    let {
      block
    } = props;

    let {
      onStartEdit, 
      onEndEdit, 
      config, 
      onChange, 
      handlePastedText, 
      uploadImageCallBack, 
      blockRenderer, 
      toolbar, 
    } = props.blockProps;

    const { 
      isReadOnly, 
      getEditorState, 
    } = config;


    let editorState = getEditorState();

    let entity = editorState.getCurrentContent().getEntity(block.getEntityAt(0));



    let {contentState_1, contentState_2} = entity.getData();



    let editorState_1;
    let editorState_2;

    if(contentState_1){
      try{

        let content1 = convertFromRaw(JSON.parse(contentState_1));
        editorState_1 = EditorState.createWithContent(content1);

      }
      catch(e){
        console.error(e);
      }
    }

    if(contentState_2){
      try{

        let content2 = convertFromRaw(JSON.parse(contentState_2));
        editorState_2 = EditorState.createWithContent(content2);

      }
      catch(e){
        console.error(e);
      }
    }


    if(!editorState_1){
      editorState_1 = EditorState.createEmpty();
    }


    if(!editorState_2){
      editorState_2 = EditorState.createEmpty();
    }


    this.state = {

      inEditMode: false,
      isReadOnly, 
      getEditorState, 
      onStartEdit, 
      onEndEdit,
      onChange,
      editable: true,
      editorState_1,
      editorState_2,
      handlePastedText,
      uploadImageCallBack,
      blockRenderer,
      toolbar,
    }

  } 


  startEdit = event => {

    event.stopPropagation();
    event.preventDefault();

    let {onStartEdit} = this.state;

    this.setState({
      inEditMode: true,
    }, () => {

      onStartEdit && onStartEdit();
    })


    return false;
  }

  endEdit = event => {

    event.stopPropagation();
    event.preventDefault();

    let {
      onEndEdit, 
      onChange,
      getEditorState,
      editorState_1,
      editorState_2,
    } = this.state;

    let {block} = this.props;

    this.setState({
      inEditMode: false,
    }, () => {

      if(onChange){
        let editorState = getEditorState();

        const contentState_1 = editorState_1.getCurrentContent();
        const contentState_2 = editorState_2.getCurrentContent();

        const contentState = editorState.getCurrentContent();
     
        const entityKey = block.getEntityAt(0); 

        // // contentState.replaceEntityData(
        const updatedContentState = contentState.mergeEntityData(
          entityKey,
          {
            contentState_1: JSON.stringify(convertToRaw(contentState_1)),
            contentState_2: JSON.stringify(convertToRaw(contentState_2)),
          },
        );

        const newEditorState = EditorState.set(editorState, {
            currentContent: updatedContentState
        });

        onChange(newEditorState);

        // onChange(editorState);
      }

      onEndEdit && onEndEdit();
    });

    return false;
  }



  onEditorStateChange = (editorState, editorName) => {

    if(!editorName){
      editorName = 'editorState';
    }



    let {
      onChange,
      name,
    } = this.props;



    let newState = {};

    newState[editorName] = editorState;

    this.setState(newState);

  }


  render(): Object {

    const { block, contentState } = this.props;
    const { 
      editorState,
      editorState_1,
      editorState_2,
      inEditMode,
      isReadOnly,
      editable,
      
      handlePastedText,
      uploadImageCallBack,
      blockRenderer,
      toolbar,
    } = this.state;
    
    let content;

    const entity = contentState.getEntity(block.getEntityAt(0));
    const { src, alignment, height, width } = entity.getData();
 
    let editorsConfig={
      readOnly: !isReadOnly || !inEditMode ? true : false,
      toolbarHidden: !isReadOnly || !inEditMode ? true : false,

      // Hide due bug https://github.com/jpuri/react-draft-wysiwyg/issues/389
      // toolbarOnFocus: true,
      editorClassName: ['Column-editor', inEditMode ? 'editable' : ''].join(" "),
      customBlockRenderFunc: blockRenderer,
      toolbarCustomButtons: [
        <ImageControl 
          config={{
            uploadEnabled: true,
            urlEnabled: false,
            uploadCallback: uploadImageCallBack,
          }}
        />,
      ],
      toolbar: toolbar,
    }

    let actions;

    if(editable && inEditMode){ 
      actions = <Grid 
        item
        xs={12}
      > 
          <Button
            raised
            accent
            onTouchTap={this.endEdit}
          >
            Сохранить
          </Button> 
      </Grid> 
    }

    content = <Grid 
      container
      // align="flex-end"
      className={['Column-editor--root', editable ? 'editable' : ''].join(" ")}
      // onTouchTap={event => {
      //   event.stopPropagation();
      //   event.preventDefault();
      //   return false;
      // }}
      onTouchTap={this.startEdit}
      gutter={8}
    > 
      {actions}

      <Grid 
        item
        xs={12}
        md={6}
      >

        <DraftEditor
          ref="editor_1"
          {...editorsConfig}
          editorState={editorState_1}
          onEditorStateChange={editorState_1 => this.setState({
            editorState_1,
          })}
          handlePastedText={(text, html) => handlePastedText.call(this, text, html, editorState_1, 'editorState_1')}
        />

      </Grid>

      <Grid 
        item
        xs={12}
        md={6}
      >
        <DraftEditor 
          ref="editor_2"
          {...editorsConfig}
          editorState={editorState_2}
          onEditorStateChange={editorState_2 => this.setState({
            editorState_2,
          })}
          handlePastedText={(text, html) => handlePastedText.call(this, text, html, editorState_2, 'editorState_2')}
        />
      </Grid>

      {actions}

    </Grid>


    return content;
  }
};

// export default ColumnsRenderer;

ColumnsRenderer.propTypes = {
  block: PropTypes.object,
  blockProps: PropTypes.object,
  contentState: PropTypes.object,
}