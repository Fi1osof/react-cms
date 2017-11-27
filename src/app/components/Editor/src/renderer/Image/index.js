import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import classNames from 'classnames';
// import Option from '../../components/Option';
import styles from './styles.less'; // eslint-disable-line no-unused-vars

// import Cropper from './Cropper';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';

import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Crop from 'material-ui-icons/Crop';

let classes;

const styleSheet = createStyleSheet('ImageBlock', (theme) => {

  var css = {
    root: {
    },
    dialog: {
      '& .dialog-paper': {
        maxWidth: '90%',
        width: 'auto',
      },
    },
    dialogContent: {
    },
  };

  return css;
});


export default class getImageComponent extends Component { 

  static defaultProps = {
    open: false,
  };


  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  };


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
      toggleCropper,
    } = props.blockProps;

    let {isReadOnly, isImageAlignmentEnabled} = config;


    this.state = {
      inEditMode: false, 
      cropperOpened: false,
      isReadOnly, 
      toggleCropper, 
      open,
    };
  }  

  renderCropper = () => {

    return null;

    let {cropperOpened} = this.state;

    // console.log('renderCropper', cropperOpened);

    return <div>
      <Button
        onTouchTap={(event) => {
          this.setCropperOpened(true);
          event.stopPropagation();
          event.preventDefault();
          return false;
        }}
      >
        <Crop />
        Обрезать  
      </Button>

    </div>
  }


  setCropperOpened = (cropperOpened) => {

    // console.log('setCropperOpened');

    const { block, contentState } = this.props;

    let {toggleCropper} = this.state;

    toggleCropper(block);
  };


  componentWillMount(){
    classes = this.context.styleManager.render(styleSheet);
  }


  handleOpen = (event) => {

    console.log("handleOpen event", event);

    event.stopPropagation();
    event.preventDefault();

    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render(): Object {
    const { block, contentState } = this.props;

    const {
      inEditMode,
      isReadOnly,
      open,
    } = this.state;

    const entity = contentState.getEntity(block.getEntityAt(0));
    const { src } = entity.getData();

    return (
      <span className="rdw-image-imagewrapper">
          <img
            src={src}
            alt=""
            className="block-image editor-image"
            onClick={::this.handleOpen}
          />
          {
            !isReadOnly() ?
              this.renderCropper()
              :
              undefined
          }

          <Dialog
            className={[classes.dialog].join(" ")}
            onRequestClose={::this.handleClose}
            open={open}
            paperClassName="dialog-paper"
          >

            <DialogContent
              className={[classes.dialogContent].join(" ")}
            >
              <img
                className="editor-image opened"
                src={src}
              />
            </DialogContent>

            <DialogActions>
              <Button
                key="close"
                onTouchTap={::this.handleClose}
              >Закрыть</Button>
            </DialogActions>
          </Dialog>
        </span>
    );
  }
};

getImageComponent.propTypes = {
  block: PropTypes.object.isRequired,
  blockProps: PropTypes.object.isRequired,
  contentState: PropTypes.object.isRequired,
  // getEditor: PropTypes.func.isRequired,
}