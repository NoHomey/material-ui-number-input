/// <reference path="./lowlight.d.ts" />
/// <reference path="./react-syntax-highlighter.d.ts" />

import SyntaxHighlighter from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/styles/tomorrow'; 
import ts = require('highlight.js/lib/languages/typescript');
import { registerLanguage } from 'lowlight/lib/core';
import * as React from 'react';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
registerLanguage('typescript', ts);
ReactDomRender(<SyntaxHighlighter language="typescript" style={style} showLineNumbers startingLineNumber={0}>{
`
import * as React from 'react';

interface DemoState {
    value?: string;
    errorText?: string;
}

class Demo extends React.Component<void, DemoState> {
    public constructor(props: void) {
        super(props);
    }

    public render(): JSX.Element {
        return <NumberInput
            

        />;
    }
}
`}</SyntaxHighlighter>, document.getElementById('react-render'));