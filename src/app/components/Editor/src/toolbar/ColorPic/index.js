import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { BlockPicker } from 'react-color';

// import icon from '../../../icons/palette.svg';
import styles from './styles.less'; // eslint-disable-line no-unused-vars

class ColorPic extends Component {

  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };


  constructor(props){

    super(props);
    console.log('ColorPic constructor', props);

    this.state = {

    }
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  onChange = (color) => {
    const { onChange } = this.props;
    onChange('color', color.hex);
  }

  componentWillReceiveProps(propTypes){
    console.log('ColorPic componentWillReceiveProps', propTypes);
  }

  renderModal = () => {
    // const { color } = this.props.currentState;
    return (
      <div
        className="demo-color-modal"
        onClick={this.stopPropagation}
      >
        dfgdfgfdg
      </div>
    );
  };

  render() {
    // const { expanded, onExpandEvent } = this.props;
    const { onExpandEvent } = this.props;
    const { expanded } = this.state;
    return (
      <div
        className="demo-color-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-color-picker"
      >
        <div
          // onClick={onExpandEvent}
          onClick={(event) => {
            console.log('ColorPic onExpandEvent', event);

            this.setState({
              expanded: true,
            });
          }}
          className="demo-icon-wrapper"
        >
          gerger
        </div>
        {expanded ? this.renderModal() : undefined}
      </div>
    );
  }
}

export default ColorPic;