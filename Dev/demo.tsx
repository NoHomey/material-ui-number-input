import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { NumberInput, NumberInputChangeHandler, NumberInputError, EventValue, NumberInputErrorHandler } from './../src/index';

const { div, link, input } = React.DOM;

interface DemoState {
    value?: number;
    errorText?: string;
}

export default class Demo extends React.Component<void, DemoState> {
    private onKeyDown: React.KeyboardEventHandler;
    private onChange: NumberInputChangeHandler;
    private onError: NumberInputErrorHandler;

    public constructor(props: void) {
        super(props);
        this.state = {};
        this.onKeyDown = (event: React.KeyboardEvent): void => {
            console.log(`onKeyDown ${event.key}`);
        }
        this.onChange = (event: React.FormEvent, value: number): void => {
            const e: EventValue = event;
            console.log(`onChange ${e.target.value}, ${value}`);
            this.setState({ value: value });
        };
        this.onError = (error: NumberInputError): void => {
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
                case 'singleMinus':
                    errorText = 'Minus can be use only for negativity';
                    break;
                case 'singleFloatingPoint':
                    errorText = 'There is already a floating point';
                    break;
                case 'singleZero':
                    errorText = 'Floating point is expected';
                    break;
                case 'min':
                    errorText = 'You are tring to enter number less than -10';
                    break;
                case 'max':
                    errorText = 'You are tring to enter number greater than 12';
                    break;
            }
            console.log(error);
            this.setState({ errorText: errorText, error: error });
        }
    }

    public componentDidMount(): void {
        this.onError('required');
    }

    public render(): JSX.Element {
        const { state, onChange, onError, onKeyDown } = this;
        const { value, errorText } = state;
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
                        errorText={errorText}
                        onChange={onChange}
                        onError={onError}
                        onKeyDown={onKeyDown} />
                </div>
            </MuiThemeProvider>
        );
    }
}