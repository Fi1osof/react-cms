import React, {Component} from 'react';

import PropTypes from 'prop-types';

import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

import Renderer from '../layout'; 

import TextField from 'material-ui/TextField';


import Grid from 'material-ui/Grid';
import { Editor as DraftEditor} from 'react-draft-wysiwyg';
import ImageControl from '../../toolbar/Image';
import ImageRenderer from '../Image';
import Cropper from '../Image/Cropper';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import UploadIcon from 'material-ui-icons/FileUpload';


import ImagesUploader from '../ImagesUploader';


export default class InvitationsRenderer extends Renderer{
 
  // render(): Object {
  //   const { block, contentState } = this.props;
  //   const { inEditMode } = this.state;
  //   const { isReadOnly } = this.state;
  //   const entity = contentState.getEntity(block.getEntityAt(0));
  //   const { data } = entity.getData();

  //   return <div>
  //     fdgfdgfd fdgdf g345345345
  //   </div>;
  // }

  constructor(props){

    super(props);


    let {
      block,
      blockProps,
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
    } = blockProps;


    const { 
      isReadOnly, 
      getEditorState, 
    } = config;

    let editorState = getEditorState();

    let entity = editorState.getCurrentContent().getEntity(block.getEntityAt(0));

    // console.log('contentState_1 entity', entity, entity.getData());

    let {contentState_2, img} = entity.getData();

    // console.log('contentState_1 contentState', contentState_1);

    let editorState_2;

    if(contentState_2){
      try{

        let content2 = convertFromRaw(JSON.parse(contentState_2));
        editorState_2 = EditorState.createWithContent(content2);
        // console.log('contentState_1 editorState', editorState_1);
      }
      catch(e){
        console.error(e);
      }
    }


    if(!editorState_2){
      editorState_2 = EditorState.createEmpty();
    }

    Object.assign(this.state, {
      value: "sdfdsfds",
      editorState_2,
      img,
    });
  }


  getTitle(title){
    console.log('getTitle 2', title);

    return super.getTitle("Пригласительные билеты");
  }

  getHelperText(text){

    text = "Необходимо заполнить минимум 1000 символов";

    return super.getHelperText(text);
  }

  updateMainState(){

    let {block} = this.props;

    let {
      onEndEdit, 
      onChange,
      editorState_2,
      getEditorState,
    } = this.state;
    
    if(onChange){
      let editorState = getEditorState();

      // console.log('editorState_1', editorState_1);
      console.log('updateMainState', editorState);

      // const contentState_1 = editorState_1.getCurrentContent();
      const contentState_2 = editorState_2.getCurrentContent();

      // console.log('contentState_1', contentState_1);
      // console.log('contentState_1 convertToRaw', convertToRaw(contentState_1));

      const contentState = editorState.getCurrentContent();
   
      const entityKey = block.getEntityAt(0); 

      // // contentState.replaceEntityData(
      const updatedContentState = contentState.mergeEntityData(
        entityKey,
        {
          // contentState_1: JSON.stringify(convertToRaw(contentState_1)),
          contentState_2: JSON.stringify(convertToRaw(contentState_2)),
        },
      );

      const newEditorState = EditorState.set(editorState, {
          currentContent: updatedContentState
      });

      console.log('updatedContentState', updatedContentState);
      console.log('newEditorState', newEditorState);

      onChange(newEditorState);

      // onChange(editorState);
    }
  }

  renderBlock(): Object {

    console.log('renderBlock', this);

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

      img,
    } = this.state;
    
    toolbar.options = ['inline', 'blockType', 'history'];

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

      <Grid 
        item
        xs={12}
        md={8}
      >
        {editable
          ?
          <div
            className="hint"
          >
            Здесь картинку вставить
          </div>
          :
          null
        }

        {img ? <img src={img} /> : null}

        <ImagesUploader
          inputId={"UploaderInvitation"}
          url="/assets/components/modxsite/connectors/connector.php?pub_action=images/upload"
          // optimisticPreviews
          inButton={false}
          multiple={false}
          dataName="file"
          onLoadEnd={(err, response) => {
            console.log('nLoadEnd succes 2 ', this);
            this.onImageUpload(err,response);
          }}
          label={<div
            className="flex-inline"
          ><UploadIcon />Выбрать файл</div>}
        />

      </Grid>

      <Grid 
        item
        xs={12}
        md={4}
      >
        {editable
          ?
          <div
            className="hint"
          >
            Написать про пригласительные
          </div>
          :
          null
        }
        <DraftEditor 
          ref="editor_2"
          {...editorsConfig}
          editorState={editorState_2}
          // onEditorStateChange={editorState_2 => this.setState({
          //   editorState_2,
          // })}
          onEditorStateChange={editorState_2 => this.onEditorStateChange(editorState_2, 'editorState_2')}
          handlePastedText={(text, html) => handlePastedText.call(this, text, html, editorState_2, 'editorState_2')}
        />
      </Grid>
 

    </Grid>


    return content;
  }
}
 
