import React, { PropTypes, Component } from 'react';
import { NoteTypes } from './NoteTypes';
import { DragSource, DropTarget } from 'react-dnd';
import Note from './Note';
import flow from 'lodash/flow';

const noteSource = {
  beginDrag(props) {
    return {
      id: props.note.id,
      dragIndex: props.index,
      index: props.index,
      dragAndDropNotes: [],
    };
  },
  /*endDrag(props, monitor) {
   const item = monitor.getItem();
   const dragNote = props.notes[item.dragIndex];
   const hoverNote = props.notes[item.index];

   if(dragNote.id === hoverNote.id) {
   return;
   }
   props.moveSelectedNote(item.dragAndDropNotes);
   },*/
};

const noteTarget = {
  hover(props, monitor) {
    //const dragId = monitor.getItem().id;
    //const hoverId = props.folder.id;

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if(dragIndex === hoverIndex) {
      return;
    }
    if(dragIndex !== hoverIndex) {
      /*monitor.getItem().dragAndDropNotes.push({
       dragId: dragId,
       dragOrder: dragIndex,
       hoverId: hoverId,
       hoverOrder: hoverIndex,
       });*/
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
    const {
      note,
      options,
      selectDeleteNote,
      deleteSelectedNote,
      connectDragSource,
      connectDropTarget,
      isDragging
    } = this.props;
    const border = isDragging ? '1px dashed gray' : '1px solid gray';
    return connectDragSource(connectDropTarget(
      <div style={{margin: '10px', border}}>
        <Note
          note={note}
          options={options}
          selectDeleteNote={selectDeleteNote}
          deleteSelectedNote={deleteSelectedNote}
          isDragging={isDragging}/>
      </div>
    ));
  }
}

DragAndDropNote.propTypes = {
  note: PropTypes.shape({
    folderId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  options: PropTypes.object.isRequired,
  moveSelectedNote: PropTypes.func.isRequired,
  selectDeleteNote: PropTypes.func.isRequired,
  deleteSelectedNote: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
  isDragging: PropTypes.bool,
  connectDropTarget: PropTypes.func,
};

export default flow(
  DragSource(NoteTypes.NOTE, noteSource, collectSource),
  DropTarget(NoteTypes.NOTE, noteTarget, collectTarget)
)(DragAndDropNote);
