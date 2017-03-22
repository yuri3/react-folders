import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import FoldersContainer from './containers/FoldersContainer';

const App = (props) => (
  <MuiThemeProvider>
    <FoldersContainer {...props}/>
  </MuiThemeProvider>
);

export default App;
