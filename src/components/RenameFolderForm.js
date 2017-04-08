import React, { PropTypes, Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton';
import UndoIcon from 'material-ui/svg-icons/content/undo';
import SaveIcon from 'material-ui/svg-icons/content/save';

const style = {
  alignSelf: 'flex-end',
};

const validate = (value, props) => {
  const error = {};
  if(!props.dirty) {return;}
  if(!value.name) {
    error.name = 'Required';
  } else if(value.name && value.name.length > 18) {
    error.name = 'Must be 18 characters or less!';
  } else if(
    props.folders.some(
      folder => !folder.parentId && !value.parentId && folder.name === value.name.trim()
    )
  ) {
    error.name = 'This name is already taken!'
  } else if(
    props.folders.some(folder => (
      folder.parentId && value.parentId === folder.parentId && folder.name === value.name.trim()
    ))
  ) {
    error.name = 'This name is already taken!'
  }
  return error;
};

const renderTextField = (field) => {
  const {
    input,
    placeholder,
    meta: {
      dirty,
      error,
    },
    handleSubmit,
    handleClose,
    ...custom
  } = field;
  return (
    <TextField
      hintText={placeholder}
      floatingLabelText={placeholder}
      errorText={dirty && error}
      {...input}
      {...custom}
      onKeyDown={(event) => {
        if(event.keyCode === 13) {
          event.preventDefault();
          handleSubmit(event);
        }
        if(event.keyCode === 27) {
          handleClose();
        }
      }}
    />
  );
};

class RenameFolderForm extends Component {
  render() {
    const {
      handleSubmit,
      handleClose,
      invalid,
      pristine
    } = this.props;
    return (
      <div>
        <form>
          <div style={{display: 'flex'}}>
            <Field
              name="name"
              type="text"
              placeholder="Name"
              style={{width: '200px'}}
              handleSubmit={handleSubmit}
              handleClose={handleClose}
              component={renderTextField}/>
            <IconButton
              tooltip="Undo"
              style={style}
              onTouchTap={handleClose}><UndoIcon/>
            </IconButton>
            <IconButton
              tooltip="Save"
              style={style}
              disabled={!!invalid || !!pristine}
              onTouchTap={handleSubmit}><SaveIcon/>
            </IconButton>
          </div>
        </form>
      </div>
    );
  }
}

RenameFolderForm.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.shape({
    parentId: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    parentId: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default props => {
  const Form = reduxForm({
    form: 'renameFolderForm' + props.initialValues.name,
    validate,
  })(RenameFolderForm);
  return <Form {...props}/>;
}
