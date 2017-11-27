import React, {Component} from 'react';

import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import customPropTypes from 'material-ui/utils/customPropTypes';

import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import { EditorState} from 'draft-js';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import lodash from 'lodash';

const defaultProps = {}


var styleSheet = createStyleSheet('Cropper', (theme) => {
	return {
		root: {
		},
		paper: {
			display: 'block',
			overflow: 'auto',
		},
		cropperWrapper: {
			
			display: 'block',
			textAlign: 'center',
		},
		appBar: {
	    // position: 'sticky',
    	// marginBottom: 30,
    	position: 'relative',
		},
	  flex: {
	    flex: 1,
	  },
	}
});

let classes;

export default class Cropper extends Component{
 
	constructor(props){

		super(props);

		console.log('Cropper constructor', props);

    this.state = {
      // editorState: EditorState.createWithContent(state),
      // editorState: "ergerg",
      // url: '/assets/images/upload/ecc7505a1278396fb547c8decfff79ca.jpg',
      url: '',
      color: 'green',
      x: 20,
      y: 10,
      width: 30,
      height: 10,
      crop: {
        x: 25,
        y: 10,
        // height: 10,
        width: 50,
 				aspect: 4/3,
 				// aspect: 16/9,
      },
    };
	}

	componentWillMount(){

    classes = this.context.styleManager.render(styleSheet);
	}

	componentDidMount(){

		const { croppingBlock, editorState } = this.props;

    // console.log('editorState', editorState);

    let block = croppingBlock;
    let contentState = editorState.getCurrentContent();

    const entityKey = block.getEntityAt(0);

    const entity = contentState.getEntity(entityKey);
    const { src } = entity.getData();

    this.setState({src});
    // console.log('startEdit entity data', { src });

    // if(!this.state.url){
    //   return;
    // }



    // let imageObj; 

    // imageObj = new Image(); 

    // imageObj.src = this.state.url; 

    // imageObj.onload = () => {

    //   this.setState({
    //     imageObj,
    //   });
    // }

    // let url = this.state.img;

    // console.log('url', url);
    // let callback = (a,b) => {

    //   console.log('callback', a,b);

    //   this.setState({
    //     image: a,
    //   });
    // }
    // Konva.Image.fromURL(url, callback);

    // var imageObj = new Image();

    // imageObj.onload = () => {
    //   var yoda = new Konva.Image({
    //     x: 50,
    //     y: 50,
    //     image: imageObj,
    //     width: 106,
    //     height: 118
    //   });
    //   // // add the shape to the layer
    //   // layer.add(yoda);
    //   // // add the layer to the stage
    //   // stage.add(layer);

    //   console.log('yoda', yoda);

    //   this.setState({
    //     image: yoda,
    //   });
    // }

  }

  componentDidUpdate(prevProps, prevState){

    if(this.props.debug){
      console.log("Cropper componentDidUpdate", this);
    }
    
    console.log("Cropper componentDidUpdate", prevProps, prevState);

    if(this.state.src && prevState.src != this.state.src){

    	let imageObj = new Image(); 

	    imageObj.src = this.state.src; 

	    imageObj.onload = () => {

	      this.setState({
	        imageObj,
	      });
	    }
    }
  }

  cropImage(loadedImg, crop) { 
    var imageWidth = loadedImg.naturalWidth;
    var imageHeight = loadedImg.naturalHeight;

    var cropX = (crop.x / 100) * imageWidth;
    var cropY = (crop.y / 100) * imageHeight;

    var cropWidth = (crop.width / 100) * imageWidth;
    var cropHeight = (crop.height / 100) * imageHeight;

    var canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    var ctx = canvas.getContext('2d');

    ctx.drawImage(loadedImg, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    console.log('cropImage', loadedImg);

    console.log(canvas.toDataURL('image/jpeg'));

    this.setState({
    	newSrc: canvas.toDataURL('image/jpeg'),
    });

    // document.write('<img src="'+ canvas.toDataURL('image/jpeg') +'" />');

    // if (HTMLCanvasElement.prototype.toBlob) {
    //   console.info('It looks like Chrome now supports HTMLCanvasElement.toBlob.. time to uncomment some code!');
    //   console.log(canvas.toBlob(ctx));
    // }

    // canvas.toBlob will be faster and non-blocking but is currently only supported in FF.
    // canvas.toBlob(function(blob) {
    //  var url = URL.createObjectURL(blob);

    //  imgDest.onload = function() {
    //    URL.revokeObjectURL(url);
    //    this.ready();
    //  };

    //  imgDest.src = url;
    // });

    // imgDest.src = canvas.toDataURL('image/jpeg');
    // this.ready();
  
  }

  updateBlock = () => {
  	let {newSrc} = this.state;

  	if(!newSrc){
  		alert("Не выбрана область редактирования");
  		return;
  	}

		let {
			open,
			onRequestClose,
			editorState,
			croppingBlock,
      onChange,
			// getEditor,
			...other
		} = this.props;

		let block = croppingBlock;
		const contentState = editorState.getCurrentContent();
 
    const entityKey = block.getEntityAt(0);


    // console.log('newEditorState', newEditorState, editorState);
    // console.log('newEditorState isEqual', newEditorState === editorState);

    // let newEditorState2 = EditorState.createWithContent(newEditorState.getCurrentContent());

    // console.log('newEditorState2', newEditorState2, editorState);
    // console.log('newEditorState2 isEqual', newEditorState === newEditorState2);

    // onChange(newEditorState2);

    // let newEditorState = EditorState.createWithContent(contentState);
    // let newContentState = newEditorState.getCurrentContent();

    // contentState.replaceEntityData(
    const updatedContentState = contentState.mergeEntityData(
    // const updatedContentState = contentState.replaceEntityData(
      entityKey,
      {
      	src: newSrc,
      },
    );

    // console.log('newEditorState diff isEqual 3', updatedContentState === contentState);

    // let newContent = lodash.cloneDeep(contentState);

    // var newEditorState = EditorState.push(editorState, contentState, 'change-block-data');
    // var newEditorState = EditorState.push(editorState, contentState, 'change-block-data');
    // var newEditorState = EditorState.push(editorState, newContent, 'change-block-data');
    // var newEditorState = EditorState.push(editorState, contentState, 'apply-entity');

    // console.log('newEditorState diff isEqual', newEditorState === editorState);


    // var content = newEditorState.getCurrentContent();
    // newEditorState = EditorState.createWithContent(content);

    // EditorState.push(newEditorState, newContentState, 'change-block-data');


    // let newEditorState = lodash.cloneDeep(editorState);
    // let newContentState = newEditorState.getCurrentContent();

    // newContentState.mergeEntityData(
    //   entityKey,
    //   {
    //   	src: newSrc,
    //   },
    // );

    // EditorState.push(newEditorState, newContentState, 'change-block-data');

    // const newEditorState = EditorState.push(editorState, updatedContentState, 'change-block-data');

    // const newEditorState = EditorState.push(editorState, updatedContentState, 'change-block-data');

    const newEditorState = EditorState.set(editorState, {
        currentContent: updatedContentState
    });

    // console.log('newEditorState diff isEqual 4', newEditorState === editorState);

    // console.log('newEditorState', newEditorState, editorState);
    // console.log('newEditorState isEqual', newEditorState === editorState);

    // let newEditorState2 = EditorState.createWithContent(newEditorState.getCurrentContent());

    // console.log('newEditorState2', newEditorState2, editorState);
    // console.log('newEditorState2 isEqual', newEditorState === newEditorState2);

    onChange(newEditorState);
    // onChange(newEditorState);

    onRequestClose();

    // getEditor().focus();
  }

	render(){

		let {
			open,
			onRequestClose,
			editorState,
			croppingBlock,
			...other
		} = this.props;


    let {
      crop, 
      x,
      y,
      width,
      height,
      src,
      imageObj,
    } = this.state;


    

    // contentState.mergeEntityData(
    //   entityKey,
    //   { alignment },
    // );
    // config.onChange(EditorState.push(config.getEditorState(), contentState, 'change-block-data'));


		return (
      <Dialog
        fullScreen
        open={open}
        onRequestClose={onRequestClose}
        transition={<Slide direction="up" />}
        className={classes.root}
        paperClassName={classes.paper}
      >
        <AppBar
        	className={classes.appBar}
        >
          <Toolbar>
            <IconButton 
            	onClick={onRequestClose} 
            	aria-label="Close"
            	contrast
            >
              <CloseIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              
            </Typography>
            <Button 
            	onClick={this.updateBlock} 
            	contrast
            >save</Button>
          </Toolbar>
        </AppBar>
        
        <div
        	className={classes.cropperWrapper}
        >
        	{src ? <ReactCrop 
	          src={src} 
	          crop={crop}
	          onChange={(crop, pixelCrop) => {
	            console.log('onChange(crop, pixelCrop)', crop, pixelCrop);
	          }}
	          onComplete={(crop, pixelCrop) => {
	            console.log('onComplete(crop, pixelCrop)', crop, pixelCrop);

	            if(imageObj){

	              this.cropImage(imageObj, crop);
	            }


	            this.setState({
	              crop,
	              ...pixelCrop
	            });
	          }}
	        /> : null}
        </div>

      </Dialog>
    );
	}
}

Cropper.defaultProps = defaultProps;

Cropper.propTypes = {
  // getEditor: PropTypes.func.isRequired,
}

Cropper.contextTypes = {
  styleManager: customPropTypes.muiRequired,
}
