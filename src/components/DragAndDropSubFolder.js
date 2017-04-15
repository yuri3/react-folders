import React, { PropTypes, Component } from 'react';
import { FolderTypes } from './FolderTypes';
import { DragSource, DropTarget } from 'react-dnd';
import Folder from './Folder';
import flow from 'lodash/flow';

const style = {
  margin: '0 0 20px 0',
  width: '350px',
};

const folderSource = {
  beginDrag(props) {
    return {
      id: props.folder.id,
      index: props.index,
    };
  }
};

const folderTarget = {
  hover(props, monitor) {
    const dragId = monitor.getItem().id;
    const hoverId = props.folder.id;

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if(dragId === hoverId) {
      return;
    }
    if(dragIndex !== hoverIndex) {
      props.moveFolder(dragIndex, hoverIndex);
    }
    monitor.getItem().id = hoverId;
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

class DragAndDropSubFolder extends Component {
  componentDidMount() {
    const img = new Image();
    img.src = '/ic_folder_black_48px.svg';
    img.onload = () => this.props.connectDragPreview(img);
  }
  render() {
    const {
      folders,
      folder,
      match,
      options,
      createNewFolder,
      selectRenameInput,
      renameSelectedFolder,
      deleteSelectedFolder,
      moveFolder,
      connectDragSource,
      connectDropTarget,
      isDragging,
    } = this.props;
    const border = isDragging ? '1px dashed gray' : '';
    return connectDragSource(connectDropTarget(
      <li style={{...style, border}}>
        <Folder
          folders={folders}
          folder={folder}
          match={match}
          options={options}
          isDragging={isDragging}
          createNewFolder={createNewFolder}
          selectRenameInput={selectRenameInput}
          renameSelectedFolder={renameSelectedFolder}
          deleteSelectedFolder={deleteSelectedFolder}
          moveFolder={moveFolder}/>
      </li>
    ));
  }
}

DragAndDropSubFolder.propTypes = {
  index: PropTypes.number.isRequired,
  /*folders: PropTypes.arrayOf(PropTypes.shape({
    parentId: PropTypes.integer,
    id: PropTypes.integer.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  folder: PropTypes.shape({
    parentId: PropTypes.integer,
    id: PropTypes.integer.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,*/
  match: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  createNewFolder: PropTypes.func.isRequired,
  selectRenameInput: PropTypes.func.isRequired,
  renameSelectedFolder: PropTypes.func.isRequired,
  deleteSelectedFolder: PropTypes.func.isRequired,
  moveFolder: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isDragging: PropTypes.bool,
};

export default flow(
  DragSource(props => FolderTypes.SUB_FOLDER + props.folder.parentId, folderSource, collectSource),
  DropTarget(props => FolderTypes.SUB_FOLDER + props.folder.parentId, folderTarget, collectTarget)
)(DragAndDropSubFolder);