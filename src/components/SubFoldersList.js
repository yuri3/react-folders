import React, { PropTypes, Component } from 'react';
import Folder from './Folder';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const style = {
  margin: '0 0 20px 0',
  width: '350px',
  cursor: 'auto',
};

class SubFoldersList extends Component {
  render() {
    const {
      folders,
      folder,
      subfolders,
      options,
      match,
      isDragging,
      createFolder,
      selectRenameInput,
      renameFolder,
      removeFolder
    } = this.props;
    return (
      <ul style={{listStyleType: 'none'}}>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
        {subfolders.map(subFolder => (
          folder.id === subFolder.parentId ?
          <li key={subFolder.id} style={style}>
            <Folder
              folders={folders}
              folder={subFolder}
              subfolders={subfolders}
              match={match}
              options={options}
              isDragging={isDragging}
              createFolder={createFolder}
              selectRenameInput={selectRenameInput}
              renameFolder={renameFolder}
              removeFolder={removeFolder}/>
          </li> : null
        ))}
        </ReactCSSTransitionGroup>
      </ul>
    )
  }
}

SubFoldersList.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  folder: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  subfolders: PropTypes.arrayOf(PropTypes.shape({
    parentId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  options: PropTypes.shape({
    renameId: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }).isRequired,
  match: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  createFolder: PropTypes.func.isRequired,
  selectRenameInput: PropTypes.func.isRequired,
  renameFolder: PropTypes.func.isRequired,
  removeFolder: PropTypes.func.isRequired,
};

export default SubFoldersList;
