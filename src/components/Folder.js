import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux'
import * as actions from '../actions/actions';
import RenameInput from './RenameInput';
import SubFoldersList from './SubFoldersList';
import './css/Folder.css';

class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedFolderId: null};
    this.createFolder = this.createFolder.bind(this);
    this.showRenameInput = this.showRenameInput.bind(this);
    this.removeFolder = this.removeFolder.bind(this);
    this.selectFolder = this.selectFolder.bind(this);
  }
  createFolder(id) {
    this.selectFolder(id);
    this.props.createFolder(id);
  }
  selectFolder(id = null) {
    this.setState({selectedFolderId: id});
  }
  showRenameInput(id) {
    const {options, selectCreateInput, selectRenameInput} = this.props;
    //if(options.isSelected) {selectCreateInput(false);}
    selectRenameInput(id);
  }
  removeFolder(id) {
    const {removeFolder, options, folder} = this.props;
    removeFolder(id);
    options.renameId === folder.id && this.showRenameInput(null);
  }
  render() {
    const {
      folder,
      subfolders,
      options,
      params,
      createFolder,
      selectRenameInput,
      renameFolder,
      removeFolder
    } = this.props;
    const isShowRenameInput = options.renameId === folder.id;
    const isFolderHasSubFolders = subfolders.some(
      subFolder => subFolder.parentId === folder.id
    );
    const {selectedFolderId} = this.state;
    return (
      <li>
        {!isShowRenameInput && <div className="parentFolder">
          {isFolderHasSubFolders && selectedFolderId !== folder.id &&
            <span onClick={() => this.selectFolder(folder.id)}>{'> '}</span>}
          {isFolderHasSubFolders && selectedFolderId === folder.id &&
            <span onClick={this.selectFolder}>{'\\/ '}</span>}
            {params.folderId === folder.id ? folder.name :
              <Link to={"/" + folder.id}>{folder.name}</Link>}
            <span className="Folder Create"
                  onClick={() => this.createFolder(folder.id)}>+</span>
            <span className="Folder Remove"
                  onClick={() => this.removeFolder(folder.id)}>X</span>
            <span className="Folder Rename"
                  onClick={() => this.showRenameInput(folder.id)}>/</span>
          </div>}
        {isShowRenameInput &&
          <RenameInput
            folder={folder}
            selectRenameInput={selectRenameInput}
            renameFolder={renameFolder} />}

        {selectedFolderId === folder.id &&
          <SubFoldersList
            folder={folder}
            subfolders={subfolders}
            params={params}
            options={options}
            createFolder={createFolder}
            selectRenameInput={selectRenameInput}
            renameFolder={renameFolder}
            removeFolder={removeFolder}/>}
      </li>
    );
  }
}

Folder.propTypes = {
  folder: React.PropTypes.object.isRequired,
  subfolders: React.PropTypes.array.isRequired,
  params: React.PropTypes.object.isRequired,
  options: React.PropTypes.object.isRequired,
  createFolder: React.PropTypes.func.isRequired,
  selectRenameInput: React.PropTypes.func.isRequired,
  renameFolder: React.PropTypes.func.isRequired,
  removeFolder: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

Folder = connect(
  undefined,
  mapDispatchToProps,
)(Folder);

export default Folder;
