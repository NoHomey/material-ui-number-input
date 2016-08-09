import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { NumberInput, NumberInputChangeHandler, NumberInputError, EventValue } from './../src/index';

const { div, link, input } = React.DOM;

interface DemoState {
    value: number;
    error: string;
}

export default class Demo extends React.Component<void, DemoState> {
    private onKeyDown: React.KeyboardEventHandler;
    private onChange: NumberInputChangeHandler;

    public constructor(props: void) {
        super(props);
        this.state = {
            value: 0,
            error: undefined
        };
        this.onKeyDown = (event: React.KeyboardEvent): void => {
            console.log(`onKeyDown ${event.key}`);
        }
        this.onChange = (event: React.FormEvent, value: number, valid: boolean, error: NumberInputError): void => {
            const e: EventValue = event;
            console.log(`onChange ${e.target.value}, ${value}, ${valid}, ${error}`);
            let errorText: string;
            switch(error) {
                case 'invalidSymbol':
                    errorText = 'You are tring to enter none number symbol';
                    break;
                case 'singleZero':
                    errorText = 'Only floating point can follow single zero';
                    break;
                case 'minValue':
                    errorText = 'ou are tring to enter number less than 0';
                    break;
                case 'maxValue':
                    errorText = 'You are tring to enter number greater than 2';
                    break;
            }
            this.setState({
                value: value,
                error: errorText
            });
        };
    }

    public render(): JSX.Element {
        const { value, error } = this.state;
        return (
            <MuiThemeProvider>
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <NumberInput
                        id="num"
                        value={value}
                        showDefaultValue={0.1}
                        minValue={0}
                        maxValue={2}
                        errorText={error}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown} />
                </div>
            </MuiThemeProvider>
        );
    }
}