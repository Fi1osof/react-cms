import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { BlockPicker } from 'react-color';

// import icon from '../../../icons/palette.svg';
import styles from './styles.less'; // eslint-disable-line no-unused-vars

import { Entity, AtomicBlockUtils } from 'draft-js';

class Grid2Columns extends Component {

  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };


  constructor(props){

    super(props);
    console.log('Grid2Columns constructor', props);

    this.state = {

    }
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  // onChange = (color) => {
  //   const { onChange } = this.props;
  //   onChange('color', color.hex);
  // }

  componentWillReceiveProps(propTypes){
    console.log('Grid2Columns componentWillReceiveProps', propTypes);
  }

  // renderModal = () => {
  //   // const { color } = this.props.currentState;
  //   return (
  //     <div
  //       className="Grid2Columns--modal"
  //       onClick={this.stopPropagation}
  //     >
  //       dfgdfgfdg
  //     </div>
  //   );
  // };

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

    console.log('insertColumns', newEditorState, newEditorState);
  }

  render() {
    // const { expanded, onExpandEvent } = this.props;
    const { onExpandEvent } = this.props;
    const { expanded } = this.state;
    return (
      <div
        className="Grid2Columns--wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="Grid2Columns--picker"
      >
        <div
          // onClick={onExpandEvent}
          onClick={(event) => {
            console.log('Grid2Columns onExpandEvent', event);

            // this.setState({
            //   expanded: true,
            // });

            this.insertColumns();
          }}
          className="Grid2Columns--icon-wrapper"
        >
          Вставить колонки
        </div>
        {expanded ? this.renderModal() : undefined}
      </div>
    );
  }
}

export default Grid2Columns;