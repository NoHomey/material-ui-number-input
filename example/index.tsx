import * as React from 'react';
import { render as ReactDomRender } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { NumberInput, NumberInputChangeHandler, NumberInputError, EventValue, NumberInputErrorHandler, NumberInputValidHandler, NumberInputReqestValueHandller } from 'material-ui-number-input';

const { div, link, input } = React.DOM;

interface DemoState {
    value?: string;
    errorText?: string;
}

export default class Demo extends React.Component<void, DemoState> {
    private onKeyDown: React.KeyboardEventHandler;
    private onChange: NumberInputChangeHandler;
    private onError: NumberInputErrorHandler;
    private onValid: NumberInputValidHandler;
    private onRequestValue: NumberInputReqestValueHandller;

    public constructor(props: void) {
        super(props);
        this.state = { value: '30' };
        this.onKeyDown = (event: React.KeyboardEvent): void => {
            console.log(`onKeyDown ${event.key}`);
        }
        this.onChange = (event: React.FormEvent, value: string): void => {
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
        const { state, onChange, onError, onValid, onKeyDown, onRequestValue } = this;
        const { value, errorText } = state;
        return (
            <MuiThemeProvider>
                <div>
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css"/>
                    <NumberInput
                        id="num"
                        required
                        min={11}
                        max={1500}
                        strategy="warn"
                        errorText={errorText}
                        onError={onError}
                        onValid={onValid}
                        onRequestValue={onRequestValue}
                        onChange={onChange}
                        onKeyDown={onKeyDown} />
                </div>
            </MuiThemeProvider>
        );
    }
}

injectTapEventPlugin();
let bootstrapNode = document.createElement('div');
ReactDomRender(<Demo />, bootstrapNode);
document.body.appendChild(bootstrapNode);