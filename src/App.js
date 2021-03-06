import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import SideBar from './components/SideBar';
import FolderListsContainer from './containers/FolderListsContainer';
import NoteListsContainer from './containers/NoteListsContainer';
import NoteFormContainer from './containers/NoteFormContainer';
import FoundNotesContainer from './containers/FoundNotesContainer';

import ModalConfirmation from './ModalConfirmation';
const getModalConfirmation = ModalConfirmation('modal-holder');

export const NoMatch = ({location}) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
);

const style = {
  display: 'flex',
  flexWrap: 'wrap',
  marginLeft: '60px',
};

const routeStyle = {
  display: 'flex',
  flex: 1,
  flexWrap: 'wrap',
};

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router getUserConfirmation={getModalConfirmation}>
          <div style={style}>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/folders"/>}/>
              <Route path="/notes/search" render={() => (
                <div style={routeStyle}>
                  <SideBar/>
                  <Route component={FolderListsContainer}/>
                  <Route component={FoundNotesContainer}/>
                </div>
              )}/>
              <Route path="/notes/:folderId/:noteId" render={({location}) => (
                <div style={routeStyle}>
                  <SideBar/>
                  <Route component={NoteListsContainer}/>
                  <Route component={NoteFormContainer}/>
                </div>
              )}/>
              <Route path="/notes/:folderId" render={({location}) => (
                <div style={routeStyle}>
                  <SideBar/>
                  <Route component={FolderListsContainer}/>
                  <Route component={NoteListsContainer}/>
                </div>
              )}/>
              <Route path="/folders" render={({location}) => (
                <div style={routeStyle}>
                  <SideBar/>
                  <Route component={FolderListsContainer}/>
                </div>
              )}/>
              <Route component={NoMatch}/>
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
