import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
// import classNames from 'classnames';
// import Option from '../../components/Option';
// import styles from './styles.less'; // eslint-disable-line no-unused-vars

// import Cropper from './Cropper';
// import { createStyleSheet } from 'jss-theme-reactor';
// import customPropTypes from 'material-ui/utils/customPropTypes';

// import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog';
// import Button from 'material-ui/Button';
// import Crop from 'material-ui-icons/Crop';

// let classes;

// const styleSheet = createStyleSheet('ImageBlock', (theme) => {

//   var css = {
//     root: {
//     },
//     dialog: {
//       '& .dialog-paper': {
//         maxWidth: '90%',
//         width: 'auto',
//       },
//     },
//     dialogContent: {
//     },
//   };

//   return css;
// });


import { Editor as GalleryEditor } from 'react-cms/src/app/components/Gallery';

import GallerySlider from 'react-cms/src/app/components/Gallery/Slider';

export default class GalleryRenderer extends Component { 


  static defaultProps = {
    // open: false,
  };

  static propTypes = {
    block: PropTypes.object.isRequired,
    blockProps: PropTypes.object.isRequired,
    contentState: PropTypes.object.isRequired,
    // getEditor: PropTypes.func.isRequired,
  }


  constructor(props){

    // console.log('Image constructor', props);

    super(props);

    const {
      open,
    } = this.props;

    let {
      onStartEdit, 
      onEndEdit, 
      config,
      // toggleCropper,
      onChange,
    } = props.blockProps;

    let {
      isReadOnly, 
      isImageAlignmentEnabled,
      getEditorState,
    } = config;


    this.state = {
      inEditMode: false, 
      cropperOpened: false,
      isReadOnly, 
      // toggleCropper, 
      open,
      item: {},
      onChange,
      getEditorState,
    };
  }

  // static contextTypes = {
  //   styleManager: customPropTypes.muiRequired,
  // };


  onUpload(data){

    // console.log("GalleryRenderer onUpload this", this);


    const {
      block,
    } = this.props;

    let {
      item,
      onChange,
      getEditorState,
    } = this.state;

    const editorState = getEditorState();


    const contentState = editorState.getCurrentContent();
 
    const entityKey = block.getEntityAt(0); 

    // console.log("GalleryRenderer onUpload getEditorState", editorState);

    if(!item || !data){
      return;
    }

    const {
      image,
    } = data;

    Object.assign(data, {
      imageFormats: {
        slider_thumb: image,
      }
    });


    let {
      gallery,
    } = item;

    gallery = gallery || [];

    gallery.push(data);

    item.gallery = gallery;

    const updatedContentState = contentState.mergeEntityData(
      entityKey,
      {
        // sdf: "DSfsdf",
        gallery,
        // gallery: JSON.stringify(convertToRaw(contentState_1)),
      },
    );

    const newEditorState = EditorState.set(editorState, {
        currentContent: updatedContentState
    });

    // console.log('updatedContentState', updatedContentState);
    // console.log('newEditorState', newEditorState);

    onChange(newEditorState);

    this.forceUpdate();

  }


  insertColumns = () => {

    const { editorState, onChange } = this.props;
    const entityKey = editorState
      .getCurrentContent()
      // .createEntity('COLUMNS', 'MUTABLE', { src, height, width })
      .createEntity('COLUMNS', 'MUTABLE', {
        // _type: 'COLUMNS',
      })
      .getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    );

    onChange && onChange(newEditorState);

    // console.log('insertColumns', newEditorState, newEditorState);
  }

  // renderCropper = () => {

  //   return null;

  //   let {cropperOpened} = this.state;

  //   // console.log('renderCropper', cropperOpened);

  //   return <div>
  //     <Button
  //       onTouchTap={(event) => {
  //         this.setCropperOpened(true);
  //         event.stopPropagation();
  //         event.preventDefault();
  //         return false;
  //       }}
  //     >
  //       <Crop />
  //       Обрезать  
  //     </Button>

  //   </div>
  // }


  // setCropperOpened = (cropperOpened) => {

  //   // console.log('setCropperOpened');

  //   const { block, contentState } = this.props;

  //   let {toggleCropper} = this.state;

  //   toggleCropper(block);
  // };


  // componentWillMount(){
  //   classes = this.context.styleManager.render(styleSheet);
  // }


  // handleOpen = (event) => {

  //   console.log("handleOpen event", event);

  //   event.stopPropagation();
  //   event.preventDefault();

  //   this.setState({open: true});
  // };

  // handleClose = () => {
  //   this.setState({open: false});
  // };

  render(){
    const { block, contentState } = this.props;

    // console.log("block", block);

    const entityKey = block.getEntityAt(0); 


    const entity = contentState.getEntity(entityKey);
    
    // console.log("entity", entity);

    // console.log("entity.getData()", entity.getData());

    const {
      gallery,
    } = entity.getData();

    let {
      item,
      inEditMode,
      isReadOnly,
      // open,
    } = this.state;

    Object.assign(item, {
      gallery,
    });

    // const entity = contentState.getEntity(block.getEntityAt(0));
    // const { src } = entity.getData();

    return (
      <div className="rdw-gallery-wrapper">

        {!isReadOnly()
          ?
          <GalleryEditor
            item={item}
            onUpload={(data) => this.onUpload(data)}
            updateItem={(a,b,c) => {
              // console.log("updateItem", a,b,c);
            }}
          />
          :
          <GallerySlider 
            gallery={item.gallery}
          />
        }
      </div>
    );
  }
};