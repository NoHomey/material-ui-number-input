import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { NumberInput, NumberInputChangeHandler, NumberInputError, EventValue, NumberInputErrorHandler, NumberInputValidHandler, NumberInputReqestValueHandller } from './../src/index';

interface DemoState {
    value?: string;
    errorText?: string;
}

export default class Demo extends React.Component<void, DemoState> {
    private onChange: NumberInputChangeHandler;
    private onError: NumberInputErrorHandler;
    private onValid: NumberInputValidHandler;
    private onRequestValue: NumberInputReqestValueHandller;

    public constructor(props: void) {
        super(props);
        this.state = { value: '30' };
        this.onChange = (event: React.FormEvent<string>, value: string): void => {
            const e: EventValue = event;
            console.log(`onChange ${e.target.value}, ${value}`);
            this.setState({ value: value });
        };
        this.onError = (error: NumberInputError): void => {
            let errorText: string = '';
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
                    errorText = 'You are tring to enter number less than 11';
                    break;
                case 'max':
                    errorText = 'You are tring to enter number greater than 150';
                    break;
            }
            this.setState({ errorText: errorText });
        }
        this.onValid = (value: number): void => {
            console.debug(`${value} is a valid number!`);
        }
        this.onRequestValue = (value: string): void => {
            console.log(`request ${JSON.stringify(value)}`);
            this.setState({ value: value })
        }
    }

    public render(): JSX.Element {
        const { state, onChange, onError, onValid, onRequestValue } = this;
        const { value, errorText } = state;
        return (
            <MuiThemeProvider>
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <NumberInput
                        id="num"
                        required
                        value={value}
                        min={11}
                        max={150}
                        strategy="ignore"
                        errorText={errorText}
                        onError={onError}
                        onValid={onValid}
                        onRequestValue={onRequestValue}
                        onChange={onChange} />
                </div>
            </MuiThemeProvider>
        );
    }
}