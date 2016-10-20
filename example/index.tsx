
import * as React from 'react';
import ReactiveExample from './ReactiveExample';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

injectTapEventPlugin();
ReactDomRender(
    <MuiThemeProvider>
        <ReactiveExample/>
    </MuiThemeProvider>
, document.getElementById('react-render'));