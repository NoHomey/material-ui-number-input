import * as React from 'react';
import TextField from 'material-ui/TextField';

export type NumberInputError = 'none' | 'invalidSymbol' | 'singleZero' | 'floatingPoint' | 'minValue' | 'maxValue';

export type NumberInputChangeHandler = (event: React.FormEvent, value: number, valid: boolean, error: NumberInputError) => void;

export interface NumberInputprops {
    className?: string;
    disabled?: boolean;
    floatingLabelFixed?: boolean;
    id?: string;
    name?: string;
    fullWidth?: boolean;
    underlineShow?: boolean;
    showDefaultValue?: number;
    minValue?: number;
    maxValue?: number;
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
    fallbackErrorText?: React.ReactNode;
    invalidSymbolErrorText?: React.ReactNode;
    singleZeroErrorText?: React.ReactNode;
    floatingPointErrorText?: React.ReactNode;
    minValueErrorText?: React.ReactNode;
    maxValueErrorText?: React.ReactNode;
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
    error?: NumberInputError;
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
        minValue: props.minValue,
        maxValue: props.maxValue,
        value: state.value,
        error: state.error
    };
}

function getChangeEvent<T extends React.SyntheticEvent>(event: T): React.SyntheticEvent {
    return Object.assign({}, event, {
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
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
    private _onKeyDown: React.KeyboardEventHandler;
    private _onBlur: React.FocusEventHandler;

    private _emitError(event: React.KeyboardEvent, error: NumberInputError): void {
        this.setState({ error: error });
        this.props.onChange(event, this.props.value, false, error);
    }

    private _tryToGetErrorText(errorText: React.ReactNode): React.ReactNode {
        return errorText !== undefined ? errorText : this.props.fallbackErrorText;
    }

    private _getErrorText(): React.ReactNode {
        switch(this.state.error) {
            case 'invalidSymbol': return this._tryToGetErrorText(this.props.invalidSymbolErrorText);
            case 'singleZero': return this._tryToGetErrorText(this.props.singleZeroErrorText);
            case 'floatingPoint': return this._tryToGetErrorText(this.props.floatingPointErrorText);
            case 'minValue': return this._tryToGetErrorText(this.props.minValueErrorText);
            case 'maxValue': return this._tryToGetErrorText(this.props.maxValueErrorText);
            default: return undefined;
        }
    }

    private _handleKeyDown(event: React.KeyboardEvent): void {
        event.preventDefault();
        const { key } = event;
        const { value } = this.state;
        const { singleZeroErrorText, invalidSymbolErrorText } = this.props;
        let maskedEvent = Object.assign({}, event, { defaultPrevented: false });
        let eventValue: EventValue = getChangeEvent(maskedEvent);
        eventValue.target.value = value;
        const emitError: (error: NumberInputError) => void = this._emitError.bind(this, eventValue);
        if((key.length  > 1) || (key.match(/^(\d||\.||\-)$/))) {
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
                        error: 'none'
                    });
                    if(newValue.match(/^-?((0(\.\d+)?)|([1-9]+(\d{0,}\.\d+)?))$/)) {
                        valueChange = Number(newValue);
                    } else {
                        emitError('floatingPoint');
                    }
                } else if(singleZeroErrorText !== undefined){
                    emitError('singleZero');
                }
            } else if(key === 'Backspace') {
                this.setState({ value: '' });
            }
            const { onKeyDown, onChange, maxValue, minValue } = this.props;
            const canCallOnKeyDown: boolean = onKeyDown !== undefined;
            if((valueChange !== undefined) && (valueChange !== this.props.value)) {
                if((maxValue !== undefined) && (valueChange > maxValue)) {
                    emitError('maxValue');
                    return;
                }
                if((minValue !== undefined) && (valueChange < minValue)) {
                    emitError('minValue');
                    return;
                }
                if(canCallOnKeyDown)  {
                    onKeyDown(maskedEvent);
                }
                if(onChange !== undefined) {
                    onChange(eventValue as React.FormEvent, valueChange, true, 'none');
                }
            } else if((key.length > 1) && (key !== 'Backspace') && canCallOnKeyDown) {
                onKeyDown(maskedEvent);
            }
        } else if(invalidSymbolErrorText !== undefined) {
            emitError('invalidSymbol');
        }
    }

    private _handleBlur(event: React.FocusEvent): void {
        const { showDefaultValue, onBlur, onChange } = this.props;
        const { error } = this.state;
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
        if((error === 'singleZero') || (error === 'invalidSymbol') || (error === 'floatingPoint')) {
            newState.error = 'none'; 
        }
        this.setState(newState);
        if(onBlur !== undefined) {
            onBlur(event);
        }
        const { value } = newState;
        const numberValue: number = Number(value);
        if((value !== undefined) && (onChange !== undefined) && (numberValue !== this.props.value)) {
            let eventValue: EventValue = getChangeEvent(event);
            eventValue.target.value = value;
            onChange(eventValue as React.FormEvent, numberValue, newState.error !== 'none', newState.error);
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
        const { invalidSymbolErrorText, singleZeroErrorText, floatingPointErrorText, minValueErrorText, maxValueErrorText } = this.props;
        const { value } = this.state;
        if(clonedProps.showDefaultValue !== undefined) {
            delete clonedProps.showDefaultValue;
        }
        if(clonedProps.fallbackErrorText !== undefined) {
            delete clonedProps.fallbackErrorText;
        }
        if(clonedProps.invalidSymbolErrorText !== undefined) {
            delete clonedProps.invalidSymbolErrorText;
        }
        if(clonedProps.singleZeroErrorText !== undefined) {
            delete clonedProps.singleZeroErrorText;
        }
        if(clonedProps.floatingPointErrorText !== undefined) {
            delete clonedProps.floatingPointErrorText;
        }
        if(clonedProps.minValue !== undefined) {
            delete clonedProps.minValue;
        }
        if(clonedProps.maxValue !== undefined) {
            delete clonedProps.maxValue;
        }
        if(clonedProps.minValueErrorText !== undefined) {
            delete clonedProps.minValueErrorText;
        }
        if(clonedProps.maxValueErrorText !== undefined) {
            delete clonedProps.maxValueErrorText;
        }
        return React.cloneElement(<TextField />, Object.assign(clonedProps, {
            type: 'text',
            value: value,
            errorText: this._getErrorText(),
            onKeyDown: this._onKeyDown,
            onBlur: this._onBlur
        }));
    }
}

export default NumberInput;