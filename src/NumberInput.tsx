import * as React from 'react';
import TextField from 'material-ui/TextField';
import * as DeepEqual from 'deep-equal';

export type NumberInputError = 'none' | 'invalidSymbol' | 'incompleteNumber' | 'floatingPoint' | 'min' | 'max' | 'required';

export type NumberInputChangeHandler = (event: React.FormEvent, value: number, valid: boolean, error: NumberInputError) => void;

export type NumberInputErrorHandler = (error: NumberInputError) => void;

export interface NumberInputprops {
    className?: string;
    disabled?: boolean;
    floatingLabelFixed?: boolean;
    id?: string;
    name?: string;
    fullWidth?: boolean;
    underlineShow?: boolean;
    showDefaultValue?: number;
    min?: number;
    max?: number;
    required?: boolean;
}

export interface NumberInputPropsDeepEqual {
    errorText?: React.ReactNode;
    errorStyle?: React.CSSProperties;
    floatingLabelFocusStyle?: React.CSSProperties;
    floatingLabelStyle?: React.CSSProperties;
    floatingLabelText?: React.ReactNode;
    hintStyle?: React.CSSProperties;
    hintText?: React.ReactNode;
    inputStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    underlineDisabledStyle?: React.CSSProperties;
    underlineFocusStyle?: React.CSSProperties;
    underlineStyle?: React.CSSProperties;
}

export interface EventValue {
    target: {
        value?: string
    }
}

export interface NumberInputProps extends NumberInputprops, NumberInputPropsDeepEqual {
    value?: number;
    onBlur?: React.FocusEventHandler;
    onChange?: NumberInputChangeHandler;
    onErrorChange?: NumberInputErrorHandler;
    onFocus?: React.FocusEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
}

export interface NumberInputState {
    value?: string;
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
        min: props.min,
        max: props.max,
        required: props.required,
        value: state.value,
    };
}

function getNumberInputPropsDeepEqual(props: NumberInputProps): NumberInputPropsDeepEqual {
    return {
        errorText: props.errorText,
        errorStyle: props.errorStyle,
        floatingLabelFocusStyle: props.floatingLabelFocusStyle,
        floatingLabelStyle: props.floatingLabelStyle,
        floatingLabelText: props.floatingLabelText,
        hintStyle: props.hintStyle,
        hintText: props.hintText,
        inputStyle: props.inputStyle,
        style: props.style,
        underlineDisabledStyle: props.underlineDisabledStyle,
        underlineFocusStyle: props.underlineFocusStyle,
        underlineStyle: props.underlineStyle
    };
}

function getChangeEvent<E extends React.SyntheticEvent>(event: E): React.SyntheticEvent {
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
    public static defaultProps: NumberInputProps = { required: false };
    private _onKeyDown: React.KeyboardEventHandler;
    private _onBlur: React.FocusEventHandler;

    private _emitChange(event: React.FormEvent, value: number, valid: boolean, error: NumberInputError): void {
        const { onChange, onErrorChange } = this.props;
        if(onChange !== undefined) {
            onChange(event, value, valid, error);
        }
        if(onErrorChange !== undefined) {
            onErrorChange(error);
        }
    }

    private _validateValue(value: number): number {
        const { max, min } = this.props;
        if((max !== undefined) && (value > max)) {
            return 1;
        }
        if((min !== undefined) && (value < min)) {
            return -1;
        }
        return 0;
    }

    private _emitError(event: React.KeyboardEvent, error: NumberInputError): void {
        this._emitChange(event, this.props.value, false, error);
    }
    
    private _handleKeyDown(event: React.KeyboardEvent): void {
        const { key } = event;
        if(key.match(/^(Backspace|.)$/)) {
            event.preventDefault();
        } else {
            return;
        }
        const { value } = this.state;
        let maskedEvent = Object.assign({}, event, { defaultPrevented: false });
        let eventValue: EventValue = getChangeEvent(maskedEvent);
        eventValue.target.value = value;
        const emitError: (error: NumberInputError) => void = this._emitError.bind(this, eventValue);
        if((key.length  > 1) || (key.match(/^(\d||\.||\-)$/))) {
            let valueChange: number;
            let newValue: string;
            eventValue.target.value = value;
            if(key === 'Backspace') {
                newValue = value.substring(0, value.length - 1);
            } else if(key.length === 1) {
                newValue = value + key;
            }
            if(newValue !== undefined) {
                if(newValue.match(/^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/)) {
                    eventValue.target.value = newValue;
                    this.setState({ value: newValue });
                    if(newValue.match(/^-?((0(\.\d+)?)|([1-9]\d{0,}(\.\d+)?))$/)) {
                        valueChange = Number(newValue);
                    } else if(newValue !== '') {
                        emitError('incompleteNumber');
                    }
                } else {
                    emitError('floatingPoint');
                }
            } else if(key === 'Backspace') {
                this.setState({ value: '' });
            }
            const { onKeyDown } = this.props;
            const canCallOnKeyDown: boolean = onKeyDown !== undefined;
            if(valueChange !== undefined) {
                if(canCallOnKeyDown)  {
                    onKeyDown(maskedEvent);
                }
                switch(this._validateValue(valueChange)) {
                    case 1:
                        emitError('max');
                        break;
                    case -1:
                        emitError('min');
                        break;
                    default:
                        this._emitChange(eventValue as React.FormEvent, valueChange, true, 'none');
                        break; 
                }
            } else if((key.length > 1) && (key !== 'Backspace') && canCallOnKeyDown) {
                onKeyDown(maskedEvent);
            }
        } else {
            emitError('invalidSymbol');
        }
    }

    private _handleBlur(event: React.FocusEvent): void {
        const { showDefaultValue, onBlur, errorText, required } = this.props;
        const oldValue: string = this.state.value;
        let value: string = oldValue;
        let newState: NumberInputState = {};
        if(value === '-') {
            value = '';
        } else {
            const last: number = value.length - 1;
            if(value[last] === '.') {
                newState.value = value.substring(0, last);
            }
        }
        if((value === '') && (showDefaultValue !== undefined)) {
            newState.value = String(showDefaultValue);
        }
        this.setState(newState);
        if(onBlur !== undefined) {
            onBlur(event);
        }
        const numberValue: number = Number(newState.value !== undefined ? newState.value : oldValue);
        let eventValue: EventValue = getChangeEvent(event);
        let error: NumberInputError = 'none';
        switch(this._validateValue(numberValue)) {
            case 1:
                error = 'max';
                break;
            case -1:
                error = 'min';
                break; 
        }
        if((value === '') && required) {
            error = 'required';
        }
        const valid: boolean = error === 'none';
        if((newState.value !== undefined) || (valid && (errorText !== undefined)) || (!valid && (errorText === undefined))) {
            eventValue.target.value = value;
            this._emitChange(eventValue as React.FormEvent, numberValue, valid, error);
        }
    }

    public constructor(props: NumberInputProps) {
        super(props);
        const { showDefaultValue, value } = this.props;
        this.state = { value: showDefaultValue !== undefined ? String(showDefaultValue) : (value !== undefined ? String(value) : '') };
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._onBlur = this._handleBlur.bind(this);
    }

    public shouldComponentUpdate(props: NumberInputProps, state: NumberInputState): boolean {
        const currentByValue: string = JSON.stringify(getNumberInputCompareByValue(props, state));
        const changeByValue: string = JSON.stringify(getNumberInputCompareByValue(this.props, this.state));
        const propsChage: boolean = !DeepEqual(getNumberInputPropsDeepEqual(props), getNumberInputPropsDeepEqual(this.props));
        const stateChange: boolean = currentByValue !== changeByValue;
        return  propsChage || stateChange;
    }

    public render(): JSX.Element {
        let clonedProps: NumberInputProps = Object.assign({}, this.props);
        const { value } = this.state;
        if(clonedProps.showDefaultValue !== undefined) {
            delete clonedProps.showDefaultValue;
        }
        if(clonedProps.onErrorChange !== undefined) {
            delete clonedProps.onErrorChange;
        }
        return React.cloneElement(<TextField />, Object.assign(clonedProps, {
            type: 'text',
            value: value,
            onKeyDown: this._onKeyDown,
            onBlur: this._onBlur
        }));
    }
}

export default NumberInput;