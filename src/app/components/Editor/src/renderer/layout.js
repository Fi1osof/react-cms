import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
// import classNames from 'classnames';
// import Option from '../../components/Option';
import styles from './styles/styles.less'; // eslint-disable-line no-unused-vars
 

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Crop from 'material-ui-icons/Crop';
import EditIcon from 'material-ui-icons/ModeEdit';
import SaveIcon from 'material-ui-icons/Check';
import AttentionIcon from 'material-ui-icons/PriorityHigh';

import Grid from 'material-ui/Grid';
 
import { Editor as DraftEditor} from 'react-draft-wysiwyg';

import ImageControl from '../toolbar/Image';
import ImageRenderer from './Image';
import Cropper from './Image/Cropper';
export default class Renderer extends Component { 

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


    

    this.state = {

      inEditMode: false,
      isReadOnly, 
      getEditorState, 
      onStartEdit, 
      onEndEdit,
      onChange,
      editable: true,
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
    } = this.state;

    let {block} = this.props; 

    this.updateMainState();

    this.setState({
      inEditMode: false,
    }, () => {

      onEndEdit && onEndEdit();
    })

    return false;
  }

  updateMainState(){
    let {
      onEndEdit, 
      onChange,
      getEditorState,
      editorState_1,
      editorState_2,
    } = this.state;

    if(onChange){
      // let editorState = getEditorState();

      // if(!editorState){
      //   return;
      // }




      // const contentState_1 = editorState_1 && editorState_1.getCurrentContent();
      // const contentState_2 = editorState_2 && editorState_2.getCurrentContent();




      // const contentState = editorState.getCurrentContent();
   
      // const entityKey = block.getEntityAt(0); 

      // // // contentState.replaceEntityData(
      // const updatedContentState = contentState.mergeEntityData(
      //   entityKey,
      //   {
      //     contentState_1: contentState_1 && JSON.stringify(convertToRaw(contentState_1)),
      //     contentState_2: contentState_2 && JSON.stringify(convertToRaw(contentState_2)),
      //   },
      // );

      // const newEditorState = EditorState.set(editorState, {
      //     currentContent: updatedContentState
      // });




      // onChange(newEditorState);
    }
  }

  onEditorStateChange(editorState, editorName){



    if(!editorName){
      editorName = 'editorState_2';
    }



    // let {
    //   onChange,
    //   name,
    // } = this.props;



    let newState = {};

    newState[editorName] = editorState;



    this.setState(newState, () => {
      this.updateMainState();
    });

  }


  saveImageToState(){
    let {block} = this.props;

    let {
      onEndEdit, 
      onChange,
      img,
      getEditorState,
    } = this.state;
    
    if(onChange){
      let editorState = getEditorState();
 

 

      const contentState = editorState.getCurrentContent();
   
      const entityKey = block.getEntityAt(0); 

      // // contentState.replaceEntityData(
      const updatedContentState = contentState.mergeEntityData(
        entityKey,
        { 
          img: img,
        },
      );

      const newEditorState = EditorState.set(editorState, {
          currentContent: updatedContentState
      });




      onChange(newEditorState);

      // onChange(editorState);
    }
  }

  onImageUpload = (err, response) => {
    if (err) {
      console.error(err);
    }
    else{

      this.setState({
        img: response.object.url,
      }, () => this.saveImageToState());
    }
  }

  
  // onTouchTap={this.startEdit}

  renderBlock(){

    return null;
  }

  getTitle(title){



    if(!title){
      return null;
    }

    let actions = [];
    
    const { 
      inEditMode,
    } = this.state;

    if(!inEditMode){
      actions.push(<IconButton
        key="startEdit"
        onClick={event => this.startEdit(event)}
      >
        <EditIcon />
      </IconButton>);
    }
    else{
      actions.push(<IconButton
        key="endEdit"
        onClick={event => this.endEdit(event)}
        accent
      >
        <SaveIcon />
      </IconButton>);
    }

    return <div
      className="title"
    >
      {actions} {title}
    </div>
  }

  getHelperText(text){

    if(!text){
      return null;
    }

    return <div
      className="helper"
    >
     <AttentionIcon /> {text}
    </div>
  }

  render(): Object {
    const { block, contentState } = this.props;
    const { inEditMode } = this.state;
    const { isReadOnly } = this.state;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const { data } = entity.getData();

    

    return <div
      className="EditorRenderer"
    >

      {this.getTitle()}
 

      {this.renderBlock()}

      {this.getHelperText()}
    </div>;
  }
};

// export default Renderer;

Renderer.propTypes = {
  block: PropTypes.object,
  blockProps: PropTypes.object,
  contentState: PropTypes.object,
}