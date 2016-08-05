import * as React from 'react';
import TextField from 'material-ui/TextField';

export type NumberInputChangeHandler = (event: React.FormEvent, value: number) => void;

export interface NumberInputprops {
    className?: string;
    disabled?: boolean;
    floatingLabelFixed?: boolean;
    id?: string;
    name?: string;
    fullWidth?: boolean;
    underlineShow?: boolean;
    showDefaultValue?: number;
}

export interface NumberInputPropsDeepEqual {
    errorStyle?: React.CSSProperties;
    floatingLabelFocusStyle?: React.CSSProperties;
    floatingLabelStyle?: React.CSSProperties;
    floatingLabelText?: React.ReactNode;
    hintStyle?: React.CSSProperties;
    hintText?: React.ReactNode;
    inputStyle?: React.CSSProperties;
    onBlur?: React.FocusEventHandler;
    onChange?: NumberInputChangeHandler;
    onFocus?: React.FocusEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
    style?: React.CSSProperties;
    underlineDisabledStyle?: React.CSSProperties;
    underlineFocusStyle?: React.CSSProperties;
    underlineStyle?: React.CSSProperties;
    singleZeroErrorText?: React.ReactNode;
    invalidSymbolErrorText?: React.ReactNode;
}

export interface EventValue {
    target: {
        value?: string
    }
}

export interface NumberInputProps extends NumberInputprops, NumberInputPropsDeepEqual {
    value: number;
}

export interface NumberInputState {
    value?: string;
    errorText?: 'none' | 'singleZero' | 'invalidSymbol';
}

interface NumberInputCompareByValue extends NumberInputprops, NumberInputState { }

function getNumberInputCompareByValue(props: NumberInputProps, state: NumberInputState): NumberInputCompareByValue {
    return {
        className: props.className,
        disabled: props.disabled,
        floatingLabelFixed: props.floatingLabelFixed,
        id: props.id,
        name: props.name,
        fullWidth: props.fullWidth,
        underlineShow: props.underlineShow,
        showDefaultValue: props.showDefaultValue,
        value: state.value,
        errorText: state.errorText
    };
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
    private _onKeyDown: React.KeyboardEventHandler;
    private _onBlur: React.FocusEventHandler;

    private _handleKeyDown(event: React.KeyboardEvent): void {
        event.preventDefault();
        const { key } = event;
        const { singleZeroErrorText, invalidSymbolErrorText } = this.props;
        if((key.length  > 1) || (key.match(/^(\d||\.||\-)$/))) {
            const { value } = this.state;
            let maskedEvent = Object.assign({}, event, { defaultPrevented: false });
            let eventValue: EventValue = Object.assign({}, maskedEvent, {
                altKey: undefined,
                charCode: undefined,
                ctrlKey: undefined,
                getModifierState: undefined,
                key: undefined,
                keyCode: undefined,
                locale: undefined,
                location: undefined,
                metaKey: undefined,
                repeat: undefined,
                shiftKey: undefined,
                which: undefined,
                type: 'change'
            });
            eventValue.target.value = value;
            let valueChange: number;
            let newValue: string;
            if(key === 'Backspace') {
                newValue = value.substring(0, value.length - 1);
            } else if(key.length === 1) {
                newValue = value + key;
            }
            if(newValue !== undefined) {
                if(newValue.match(/^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/)) {
                    eventValue.target.value = newValue;
                    this.setState({
                        value: newValue,
                        errorText: 'none'
                    });
                    if(newValue.match(/^-?((0(\.\d{0,})?)|([1-9]+(\d{0,}\.\d{0,})?))$/)) {
                        valueChange = Number(newValue);
                    }
                } else if(singleZeroErrorText !== undefined){
                    this.setState({ errorText: 'singleZero' });
                }
            } else if(key === 'Backspace') {
                this.setState({ value: '' });
            }
            const { onKeyDown, onChange } = this.props;
            const valueDiff: boolean = (valueChange !== undefined) && (valueChange !== this.props.value);
            if((onKeyDown !== undefined) && ((key.length > 1)) || valueDiff)  {
                onKeyDown(maskedEvent);
            }
            if((onChange !== undefined) && valueDiff) {
                onChange(eventValue as React.FormEvent, valueChange);
            }
        } else if(invalidSymbolErrorText !== undefined) {
            this.setState({ errorText: 'invalidSymbol' });
        }
    }

    private _handleBlur(event: React.FocusEvent): void {
        const { showDefaultValue, onBlur } = this.props;
        let currentValue: string = this.state.value;
        let newState: NumberInputState = {};
        if(currentValue === '-') {
            currentValue = '';
        } else {
            const last: number = currentValue.length - 1;
            if(currentValue[last] === '.') {
                newState.value = currentValue.substring(0, last);
            }
        }
        if((currentValue === '') && (showDefaultValue !== undefined)) {
            newState.value = String(showDefaultValue);
        }
        if(this.state.errorText !== 'none') {
            newState.errorText = 'none'; 
        }
        this.setState(newState);
        if(onBlur !== undefined) {
            onBlur(event);
        }
    }

    public constructor(props: NumberInputProps) {
        super(props);
        const { showDefaultValue } = this.props;
        this.state = { value: showDefaultValue !== undefined ? String(showDefaultValue) : '' };
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._onBlur = this._handleBlur.bind(this);
    }

    public shouldComponentUpdate(props: NumberInputProps, state: NumberInputState): boolean {
        const currentByValue: string = JSON.stringify(getNumberInputCompareByValue(props, state));
        const changeByValue: string = JSON.stringify(getNumberInputCompareByValue(this.props, this.state));
        return currentByValue !== changeByValue;
    }

    public render(): JSX.Element {
        let clonedProps: NumberInputProps = Object.assign({}, this.props);
        let errorTextProp: React.ReactNode;
        const { singleZeroErrorText, invalidSymbolErrorText } = this.props;
        const { value, errorText } = this.state;
        if(clonedProps.showDefaultValue !== undefined) {
            delete clonedProps.showDefaultValue;
        }
        if(clonedProps.singleZeroErrorText !== undefined) {
            delete clonedProps.singleZeroErrorText;
        }
        if(clonedProps.invalidSymbolErrorText !== undefined) {
            delete clonedProps.invalidSymbolErrorText;
        }
        if((errorText === 'singleZero') && (singleZeroErrorText !== undefined)) {
            errorTextProp = singleZeroErrorText;
        }
        if((errorText === 'invalidSymbol') && (invalidSymbolErrorText !== undefined)) {
            errorTextProp = invalidSymbolErrorText;
        }
        return React.cloneElement(<TextField />, Object.assign(clonedProps, {
            type: 'text',
            value: value,
            errorText: errorTextProp,
            onKeyDown: this._onKeyDown,
            onBlur: this._onBlur
        }));
    }
}

export default NumberInput;