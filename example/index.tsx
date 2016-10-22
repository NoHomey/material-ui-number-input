import * as React from 'react';
import ReactiveExample from './ReactiveExample';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
ReactDomRender(<ReactiveExample />, document.getElementById('react-render'));