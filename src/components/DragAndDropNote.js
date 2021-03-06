import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NoteTypes } from './NoteTypes';
import { DragSource, DropTarget } from 'react-dnd';
import NoteContainer from '../containers/NoteContainer';
import flow from 'lodash/flow';

const noteSource = {
  beginDrag(props) {
    return {
      id: props.note.id,
      index: props.index,
    };
  },
};

const noteTarget = {
  hover(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if(dragIndex === hoverIndex) {
      return;
    }
    if(dragIndex !== hoverIndex) {
      props.moveSelectedNote({dragIndex, hoverIndex});
    }
    monitor.getItem().index = hoverIndex;
  },
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

class DragAndDropNote extends Component {
  componentDidMount() {
    const img = new Image();
    img.src = '/description.svg';
    img.onload = () => this.props.connectDragPreview(img);
  }
  render() {
    const {note, connectDragSource, connectDropTarget, isDragging} = this.props;
    const border = isDragging ? '1px dashed gray' : '1px solid gray';
    return connectDragSource(connectDropTarget(
      <div style={{margin: 10, border}}>
        <NoteContainer note={note} isDragging={isDragging}/>
      </div>
    ));
  }
}

DragAndDropNote.propTypes = {
  index: PropTypes.number.isRequired,
  note: PropTypes.shape({
    folderId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  moveSelectedNote: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
  isDragging: PropTypes.bool,
  connectDropTarget: PropTypes.func,
};

export default flow(
  DragSource(NoteTypes.NOTE, noteSource, collectSource),
  DropTarget(NoteTypes.NOTE, noteTarget, collectTarget)
)(DragAndDropNote);
