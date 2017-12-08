import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import icon from '../../../icons/palette.svg';
// import styles from './styles.less'; // eslint-disable-line no-unused-vars

// import { Entity, AtomicBlockUtils } from 'draft-js';

import { RichUtils, EditorState, Modifier } from 'draft-js';

import {
  getSelectionText,
  getEntityRange,
  getSelectionEntity,
} from 'draftjs-utils';

// import Icon from "material-ui-icons/Store";

import LinkControl from 'react-draft-wysiwyg/src/controls/Link';

export default class CompanyControl extends LinkControl {


  getCurrentValues = () => {
    const { editorState } = this.props;
    const { currentEntity } = this.state;
    const contentState = editorState.getCurrentContent();
    const currentValues = {};
    if (currentEntity && (contentState.getEntity(currentEntity).get('type') === 'COMPANY')) {
      currentValues.link = {};
      const entityRange = currentEntity && getEntityRange(editorState, currentEntity);
      currentValues.link.target = currentEntity && contentState.getEntity(currentEntity).get('data').company_id;
      currentValues.link.targetOption = currentEntity && contentState.getEntity(currentEntity).get('data').target;
      currentValues.link.title = (entityRange && entityRange.text);
    }
    currentValues.selectionText = getSelectionText(editorState);
    return currentValues;
  }
  

  addLink: Function = (linkTitle, linkTarget, linkTargetOption): void => {
    const { editorState, onChange } = this.props;
    const { currentEntity } = this.state;
    let selection = editorState.getSelection();

    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end,
      });
    }
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('COMPANY', 'MUTABLE', { company_id: linkTarget, target: linkTargetOption })
      .getLastCreatedEntityKey();

    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );
    let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + linkTitle.length,
      focusOffset: selection.get('anchorOffset') + linkTitle.length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      ' ',
      newEditorState.getCurrentInlineStyle(),
      undefined,
    );
    onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
    this.doCollapse();
  };

  // render(): Object {
  //   const { config, translations } = this.props;
  //   const { expanded } = this.state;
  //   const { link, selectionText } = this.getCurrentValues();
  //   const LinkComponent = config.component || LayoutComponent;
  //   return (
  //     <LinkComponent
  //       config={config}
  //       translations={translations}
  //       expanded={expanded}
  //       onExpandEvent={this.onExpandEvent}
  //       doExpand={this.doExpand}
  //       doCollapse={this.doCollapse}
  //       currentState={{
  //         link,
  //         selectionText,
  //       }}
  //       onChange={this.onChange}
  //     />
  //   );
  // }

  // renderInFlatList(): Object {
  //   const {
  //     config: { options, link, unlink, className },
  //     currentState,
  //     expanded,
  //     translations,
  //   } = this.props;




  //   return super.renderInFlatList();
  // }

  // renderInDropDown(): Object {
  //   const {
  //     expanded,
  //     onExpandEvent,
  //     doCollapse,
  //     doExpand,
  //     onChange,
  //     config,
  //     currentState,
  //     translations,
  //   } = this.props;



  //   return super.renderInDropDown();
  // }

  // static propTypes = {
  //   expanded: PropTypes.bool,
  //   onExpandEvent: PropTypes.func,
  //   onChange: PropTypes.func,
  //   currentState: PropTypes.object,
  // };


  // constructor(props){

  //   super(props);



  //   this.state = {

  //   }
  // }

  // stopPropagation = (event) => {
  //   event.stopPropagation();
  // };

  // insertColumns = () => {

  //   const { editorState, onChange } = this.props;
  //   const entityKey = editorState
  //     .getCurrentContent()
  //     // .createEntity('COLUMNS', 'MUTABLE', { src, height, width })
  //     .createEntity('COMPANY', 'MUTABLE', {
  //       // _type: 'COLUMNS',
  //     })
  //     .getLastCreatedEntityKey();
  //     const newEditorState = AtomicBlockUtils.insertAtomicBlock(
  //       editorState,
  //       entityKey,
  //       ' '
  //     );

  //   onChange && onChange(newEditorState);


  // }

  // render() {
  //   // const { expanded, onExpandEvent } = this.props;
  //   const { onExpandEvent } = this.props;
  //   const { expanded } = this.state;
  //   return (
  //     <div
  //       className="Company--wrapper"
  //       aria-haspopup="true"
  //       aria-expanded={expanded}
  //       aria-label="Company--picker"
  //     >
  //       <div
  //         // onClick={onExpandEvent}
  //         onClick={(event) => {


  //           // this.setState({
  //           //   expanded: true,
  //           // });

  //           this.insertColumns();
  //         }}
  //         className="Company--icon-wrapper rdw-image-wrapper"
  //         aria-haspopup="true"
  //         aria-expanded={false}
  //         aria-label="rdw-company-control"
  //         title={"Компания"}
  //       >
  //         <Icon />
  //       </div>
  //       {expanded ? this.renderModal() : undefined}
  //     </div>
  //   );
  // }
}