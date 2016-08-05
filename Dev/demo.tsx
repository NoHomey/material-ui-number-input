import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { NumberInput, NumberInputChangeHandler, NumberInputError } from './../src/index';

const { div, link, input } = React.DOM;

interface DemoState {
    value: number;
}

export default class Demo extends React.Component<void, DemoState> {
    private onKeyDown: React.KeyboardEventHandler;
    private onChange: NumberInputChangeHandler;

    public constructor(props: void) {
        super(props);
        this.state = { value: 0 };
        this.onKeyDown = (event: React.KeyboardEvent): void => {
            console.log(`onKeyDown ${event.key}`);
        }
        this.onChange = (event: React.FormEvent, value: number, valid: boolean, error: NumberInputError): void => {
            console.log(`onChange ${value}, ${valid}, ${error}`);
            this.setState({value: value});
        };
    }

    public render(): JSX.Element {
        return (
            <MuiThemeProvider>
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <NumberInput
                        id="num"
                        value={this.state.value}
                        showDefaultValue={0.1}
                        minValue={0}
                        maxValue={1}
                        singleZeroErrorText="Only floating point can follow single zero"
                        invalidSymbolErrorText="You are tring to enter none number symbol"
                        minValueErrorText="You are tring to enter number less than 0"
                        maxValueErrorText="You are tring to enter number larger than 1"
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown} />
                </div>
            </MuiThemeProvider>
        );
    }
}