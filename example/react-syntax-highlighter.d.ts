declare module 'react-syntax-highlighter' {
    import SyntaxHighlighter from 'react-syntax-highlighter/dist/light';
    export default SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/light' {
    import * as React from 'react';

    interface SyntaxHighlighterProps {
        language?: string;
        style?: any;
        customStyle?: any;
        codeTagProps?: HTMLElement;
        useInlineStyles?: boolean;
        showLineNumbers?: boolean;
        startingLineNumber?: number;
        lineNumberStyle?: any;
        [spread: string]: any;
    }

    export default class SyntaxHighlighter extends React.Component<SyntaxHighlighterProps, any> { 
        
    }
}

declare module 'react-syntax-highlighter/dist/styles';
declare module 'react-syntax-highlighter/dist/styles/*';