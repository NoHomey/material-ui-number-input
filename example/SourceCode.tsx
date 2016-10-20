/// <reference path="./lowlight.d.ts" />
/// <reference path="./react-syntax-highlighter.d.ts" />

import SyntaxHighlighter from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/styles/tomorrow'; 
import ts = require('highlight.js/lib/languages/typescript');
import js = require('highlight.js/lib/languages/javascript');
import { registerLanguage } from 'lowlight/lib/core';
import * as React from 'react';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Code from 'material-ui/svg-icons/action/code';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import bind from 'bind-decorator';
import { TouchTapEvent } from 'material-ui';

interface SourceCodeProps {
    onLanguageChange: (language: string) => void;
    language: string;
    code: string;
}

export const javascript: string = 'javascript';
export const typescript: string = 'typescript';
const JavaScript: string = 'JavaScript';
const TypeScript: string = 'TypeScript';
const title: string = "Source code: ";
const themeColor1: string = '#155799';
const themeColor2: string = '#159957';
const CodeSize: number = 40;
const startingLineNumber: number = 0 ;
const labelStyle: React.CSSProperties = { color: themeColor1 };
const underlineStyle: React.CSSProperties = { backgroundColor: themeColor1 };
const CodeStyle: React.CSSProperties = { width: CodeSize, height: CodeSize, color: themeColor2 };

registerLanguage(typescript, ts);
registerLanguage(javascript, js);

export class SourceCode extends React.Component<SourceCodeProps, void> {
    @bind
    private changeLanguage(event: TouchTapEvent, index: number, value: string): void {
        this.props.onLanguageChange(value);
    }

    public constructor(props: SourceCodeProps) {
        super(props);    }

    public render(): JSX.Element {
        const { language, code } = this.props;
        return (
            <Paper>
                <Toolbar>
                    <ToolbarGroup firstChild>
                        <ToolbarTitle text={title} />
                        <SelectField
                            value={language}
                            onChange={this.changeLanguage}
                            labelStyle={labelStyle}
                            underlineStyle={underlineStyle}>
                                <MenuItem value={javascript} primaryText={JavaScript} />
                                <MenuItem value={typescript} primaryText={TypeScript} />
                        </SelectField>
                    </ToolbarGroup>
                    <ToolbarGroup lastChild>
                        <Code style={CodeStyle} />
                    </ToolbarGroup>
                </Toolbar>
                <SyntaxHighlighter
                    language={language}
                    style={style}
                    showLineNumbers
                    startingLineNumber={startingLineNumber}>
                        {code}
                </SyntaxHighlighter>
            </Paper>
        );
    }
}

export default SourceCode;