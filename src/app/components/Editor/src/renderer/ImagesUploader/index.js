import React, {Component} from 'react';

import PropTypes from 'prop-types';

import ImagesUploaderProto from 'react-images-uploader';
import 'react-images-uploader/styles.css';
import 'react-images-uploader/font.css';


export default class ImagesUploader extends ImagesUploaderProto{

  async loadImages(files: FileList, url: string, onLoadEnd?: Function): any {
    if (url) {
      try {
        const imageFormData = new FormData();

        for (let i = 0; i < files.length; i++) {
          imageFormData.append(this.props.dataName, files[i], files[i].name);
        }

        let response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          body: imageFormData,
          headers: this.props.headers
        });

        if (response && response.status && response.status === 200) {



          response = await response.json();



          const multiple = this.props.multiple;
          if (response.success && response.object && response.object.url) {
            let imagePreviewUrls = [];
            // if (multiple === false) {
            //   imagePreviewUrls = response instanceof Array ? response : [response];
            // } else {
            //   imagePreviewUrls = this.state.imagePreviewUrls.concat(response);
            // }

            // imagePreviewUrls.push(response.object.url);

            this.setState({
              imagePreviewUrls,
              optimisticPreviews: [],
              loadState: 'success',
            });

            if (onLoadEnd && typeof onLoadEnd === 'function') {
              onLoadEnd(false, response);
            }

          } else {
            const err = {
              message: 'invalid response type',
              response,
              fileName: 'ImagesUploader',
            };
            this.setState({
              loadState: 'error',
              optimisticPreviews: [],
            });
            if (onLoadEnd && typeof onLoadEnd === 'function') {
              onLoadEnd(err);
            }
          }
        } else {
          const err = {
            message: 'server error',
            status: response ? response.status : false,
            fileName: 'ImagesUploader',
          };
          this.setState({
            loadState: 'error',
            optimisticPreviews: [],
          });
          if (onLoadEnd && typeof onLoadEnd === 'function') {
            onLoadEnd(err);
          }
        }
      } catch (err) {
        if (onLoadEnd && typeof onLoadEnd === 'function') {
          onLoadEnd(err);
        }
        this.setState({
          loadState: 'error',
          optimisticPreviews: [],
        });
      }
    }
  }
}

Object.assign(ImagesUploader.propTypes, {
  label: PropTypes.object,
});

