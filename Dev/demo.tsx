import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { NumberInput, NumberInputChangeHandler, NumberInputError, EventValue, NumberInputErrorHandler } from './../src/index';

const { div, link, input } = React.DOM;

interface DemoState {
    value?: number;
    error?: string;
}

export default class Demo extends React.Component<void, DemoState> {
    private onKeyDown: React.KeyboardEventHandler;
    private onChange: NumberInputChangeHandler;
    private onErrorChange: NumberInputErrorHandler;

    public constructor(props: void) {
        super(props);
        this.state = {};
        this.onKeyDown = (event: React.KeyboardEvent): void => {
            console.log(`onKeyDown ${event.key}`);
        }
        this.onChange = (event: React.FormEvent, value: number, valid: boolean, error: NumberInputError): void => {
            const e: EventValue = event;
            console.log(`onChange ${e.target.value}, ${value}, ${valid}, ${error}`);
            if(valid) {
                this.setState({ value: value });
            }
        };
        this.onErrorChange = (error: NumberInputError): void => {
            let errorText: string;
            switch(error) {
                case 'required':
                    errorText = 'This field is required';
                    break;
                case 'invalidSymbol':
                    errorText = 'You are tring to enter none number symbol';
                    break;
                case 'incompleteNumber':
                    errorText = 'Number is incomplete';
                    break;
                case 'singleNoneNumber':
                    errorText = 'Single floating point or minus is expected';
                    break;
                case 'min':
                    errorText = 'You are tring to enter number less than -10';
                    break;
                case 'max':
                    errorText = 'You are tring to enter number greater than 12';
                    break;
            }
            this.setState({ error: errorText });
        }
    }

    public componentDidMount(): void {
        this.onErrorChange('required');
    }

    public render(): JSX.Element {
        const { value, error } = this.state;
        return (
            <MuiThemeProvider>
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <NumberInput
                        id="num"
                        required
                        value={value}
                        min={-10}
                        max={12}
                        errorText={error}
                        onChange={this.onChange}
                        onErrorChange={this.onErrorChange}
                        onKeyDown={this.onKeyDown} />
                </div>
            </MuiThemeProvider>
        );
    }
}