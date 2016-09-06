import * as React from 'react';
import TextField from 'material-ui/TextField';
import ObjectAssign = require('object-assign');

export type NumberInputError = 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus'
    | 'singleFloatingPoint' | 'singleZero'| 'min' | 'max' | 'required' | 'clean';

export type NumberInputChangeHandler = (event: React.FormEvent, value: string) => void;

export type NumberInputValidHandler = (valid: number) => void;

export type NumberInputErrorHandler = (error: NumberInputError) => void;

export type NumberInputReqestValueHandller = (value: string) => void;

export interface EventValue {
    target: {
        value?: string
    }
}

export interface NumberInputProps {
    className?: string;
    disabled?: boolean;
    floatingLabelFixed?: boolean;
    id?: string;
    name?: string;
    fullWidth?: boolean;
    underlineShow?: boolean;
    defaultValue?: number;
    min?: number;
    max?: number;
    required?: boolean;
    strategy?: 'ignore' | 'warn' | 'allow';
    value?: string;
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
    onBlur?: React.FocusEventHandler;
    onChange?: NumberInputChangeHandler;
    onError?: NumberInputErrorHandler;
    onValid?: NumberInputValidHandler;
    onRequestValue?: NumberInputReqestValueHandller;
    onFocus?: React.FocusEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
}

export type NumberInputErrorExtended = NumberInputError | 'limit' | 'allow';

export interface NumberInputState {
    error?: NumberInputErrorExtended;
}

function getChangeEvent<E extends React.SyntheticEvent>(event: E): React.SyntheticEvent {
    return {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        currentTarget: event.currentTarget,
        defaultPrevented: event.defaultPrevented,
        eventPhase: event.eventPhase,
        isTrusted: event.isTrusted,
        nativeEvent: event.nativeEvent,
        preventDefault: event.preventDefault,
        isDefaultPrevented: event.isDefaultPrevented,
        stopPropagation: event.stopPropagation,
        isPropagationStopped: event.isPropagationStopped,
        persist: event.persist,
        target: event.target,
        timeStamp: event.timeStamp,
        type: 'change',
    };
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
    private static _getValidValue(value: string): string {
        const emptyString: string = '';
        const match: RegExpMatchArray = value.match(NumberInput._allowed);
        console.log(match);
        return match !== null ? (match.index === 0 ? match[0] : match.join(emptyString)) : emptyString;
    }

    private static _validSymbols: RegExp = /(\-|\.|\d)+/;
    private static _stricAllowed: RegExp = /^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/;
    private static _validNumber: RegExp = /^-?((0(\.\d+)?)|([1-9]\d{0,}(\.\d+)?))$/;
    private static _allowed: RegExp = /-?((0|([1-9]\d{0,}))(\.\d{0,})?)?/;

    public static propTypes: Object = {
        children: React.PropTypes.node,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        errorStyle: React.PropTypes.object,
        errorText: React.PropTypes.node,
        floatingLabelFixed: React.PropTypes.bool,
        floatingLabelFocusStyle: React.PropTypes.object,
        floatingLabelStyle: React.PropTypes.object,
        floatingLabelText: React.PropTypes.node,
        fullWidth: React.PropTypes.bool,
        hintStyle: React.PropTypes.object,
        hintText: React.PropTypes.node,
        id: React.PropTypes.string,
        inputStyle: React.PropTypes.object,
        name: React.PropTypes.string,
        onBlur: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onValid: React.PropTypes.func,
        onError: React.PropTypes.func,
        onRequestValue: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        style: React.PropTypes.object,
        underlineDisabledStyle: React.PropTypes.object,
        underlineFocusStyle: React.PropTypes.object,
        underlineShow: React.PropTypes.bool,
        underlineStyle: React.PropTypes.object,
        defaultValue: React.PropTypes.number,
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        required: React.PropTypes.bool,
        strategy: React.PropTypes.oneOf(['ignore', 'warn', 'allow']),
        value: React.PropTypes.string
    };
    public static defaultProps: NumberInputProps = { required: false, strategy: 'allow' };
    public textField: TextField;
    private _lastValid: string;
    private _refTextField: (textField: TextField) => void;
    private _onChange: React.FormEventHandler;
    private _onBlur: React.FocusEventHandler;

    private _emitEvents(nextError: NumberInputErrorExtended, value: string, valid: boolean = true): void {
        const { props, state } = this;
        const { onError, onValid, strategy } = props;
        const { error } = state;
        const ignore: boolean = (strategy === 'ignore');
        const correctError: NumberInputErrorExtended = (nextError !== 'allow' || ignore) ? nextError : 'min';
        if((error !== correctError)) {
            if((onError !== undefined) && !ignore && (correctError !== 'limit')) {
                onError(correctError as NumberInputError);
            }
            this.setState({ error: correctError });
        }
        if((nextError === 'none') && (onValid !== undefined) && (this._lastValid !== value) && valid) {
            onValid(Number(value));
            this._lastValid = value;
        }
    }

    private _validateNumberValue(value: number): number {
        const { max, min } = this.props;
        if((max !== undefined) && (value > max)) {
            return 1;
        }
        if((min !== undefined) && (value < min)) {
            return -1;
        }
        return 0;
    }

    private _validateValue(value: string): NumberInputErrorExtended {
        const { props } = this;
        const { required, strategy, max, min } = props;
        if(value === '') {
            return required ? 'required' : 'clean';
        } else {
            if(value.match(NumberInput._validSymbols)) {
                if(value.match(NumberInput._stricAllowed)) {
                    if(value.match(NumberInput._validNumber)) {
                        const numberValue: number = Number(value);
                        switch(this._validateNumberValue(numberValue)) {
                            case 1: return 'max';
                            case -1: return ((strategy !== 'allow') && (min > 0) && (numberValue >= 0)) ? 'allow' : 'min';
                            default: return 'none';
                        }
                    } else {
                        const checkLimit: number = parseFloat(value.substring(0, value.length - 1));
                        return ((strategy === 'ignore') && ((checkLimit === max) || ((checkLimit === min) && (min < 0)) || (isNaN(checkLimit) && (min >= 0)))) ? 'limit' : 'incompleteNumber';
                    }
                } else {
                    switch(value[value.length - 1]) {
                        case '-': return 'singleMinus';
                        case '.': return 'singleFloatingPoint';
                        default : return 'singleZero';
                    }
                }
            } else {
                return 'invalidSymbol';
            }
        }
    }

    private _takeActionForValue(value: string): void {
        console.log(`_takeActionForValue(${value})`);
        const { strategy, onRequestValue, min, max, value: propsValue } = this.props;
        const { error: stateError } = this.state;
        const error: NumberInputErrorExtended = this._validateValue(value);
        let valid: string = NumberInput._getValidValue(value);
        this._emitEvents(error, valid);
        if(strategy !== 'allow') {
            if(error === 'min') {
                valid = String(min);
            }
            if(error === 'max') {
                valid = String(max);
            }
            if(valid !== value) {
                if(propsValue === undefined) {
                    this.getInputNode().value = valid;
                } else if(onRequestValue) {
                    onRequestValue(valid);
                }
            }
        }
    }

    private _handleTextField(textField: TextField): void {
        this.textField = textField;
    } 

    private _handleChange(event: React.FormEvent): void {
        const eventValue: EventValue = event;
        const { value } = eventValue.target;
        const { onChange } = this.props;
        if(onChange !== undefined) {
            onChange(event, value);
        }
        this._takeActionForValue(value);
    }

    private _handleBlur(event: React.FocusEvent): void {
        const eventValue: EventValue = event;
        const { strategy, onBlur } = this.props;
        const { value } = eventValue.target;
        if(strategy === 'warn') {
            this._emitEvents(this._validateValue(value), value, false);
        }
        if(onBlur !== undefined) {
            onBlur(event);
        }
    }

    public getInputNode(): HTMLInputElement {
        return this.textField.getInputNode();
    }

    public getTextField(): TextField {
        return this.textField;
    }

    public constructor(props: NumberInputProps) {
        super(props);
        this.state = { error: undefined };
        this._refTextField = this._handleTextField.bind(this);
        this._onChange = this._handleChange.bind(this);
        this._onBlur = this._handleBlur.bind(this);
    }

    public componentDidMount(): void {
        const { value } = this.props;
        this._takeActionForValue(value !== undefined ? value : this.getInputNode().value);
    }

    public componentWillReceiveProps(props: NumberInputProps) {
        const { value } = props;
        if((value !== undefined) && (value !== this.props.value)) {
            this._takeActionForValue(value);
        }
    }

    public render(): JSX.Element {
        const { props, state, _refTextField, _onChange, _onBlur } = this;
        const { value, defaultValue, strategy } = props;
        let clonedProps: NumberInputProps = ObjectAssign({}, props);
        if(clonedProps.strategy !== undefined) {
            delete clonedProps.strategy;
        }
        if(clonedProps.onError !== undefined) {
            delete clonedProps.onError;
        }
        if(clonedProps.onValid !== undefined) {
            delete clonedProps.onValid;
        }
        if(clonedProps.onRequestValue !== undefined) {
            delete clonedProps.onRequestValue;
        }
        const inputProps: NumberInputProps = ObjectAssign(clonedProps, {
            type: 'text',
            defaultValue: defaultValue === undefined ? defaultValue : String(defaultValue), 
            value: value,
            onChange: _onChange,
            onBlur: _onBlur,
            ref: _refTextField
        });
        if(value === undefined) {
            delete inputProps.value;
        }
        return React.cloneElement(<TextField />, inputProps);
    }
}

export default NumberInput;