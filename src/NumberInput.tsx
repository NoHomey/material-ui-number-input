import * as React from 'react';
import TextField from 'material-ui/TextField';
import * as DeepEqual from 'deep-equal';

export type NumberInputError = 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus' | 'singleFloatingPoint' | 'singleZero' | 'min' | 'max' | 'required';

export type NumberInputChangeHandler = (event: React.FormEvent, value: string) => void;

export type NumberInputValidHandler = (valid: number) => void;

export type NumberInputErrorHandler = (error: NumberInputError) => void;

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
    showDefaultValue?: number;
    min?: number;
    max?: number;
    required?: boolean;
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
    onFocus?: React.FocusEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
}

export interface NumberInputState {
    error?: NumberInputError;
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
        //isDefaultPrevented: event.isDefaultPrevented,
        stopPropagation: event.stopPropagation,
        //isPropagationStopped: event.isPropagationStopped,
        persist: event.persist,
        target: event.target,
        timeStamp: event.timeStamp,
        type: 'change',
    };
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
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
        onErrro: React.PropTypes.func,
        onKeyDown: React.PropTypes.func,
        style: React.PropTypes.object,
        underlineDisabledStyle: React.PropTypes.object,
        underlineFocusStyle: React.PropTypes.object,
        underlineShow: React.PropTypes.bool,
        underlineStyle: React.PropTypes.object,
        showDefaultValue: React.PropTypes.number,
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        required: React.PropTypes.bool,
        value: React.PropTypes.string
    };
    public static defaultProps: NumberInputProps = { required: false };
    public textField: TextField;
    private _onKeyDown: React.KeyboardEventHandler;
    private _onChange: React.FormEventHandler;
    private _onBlur: React.FocusEventHandler;

    private _emitError(nextError: NumberInputError): void {
        const { props, state } = this;
        const { onError } = props;
        const { error } = state;
        if((error !== nextError)) {
            if(onError !== undefined) {
                onError(nextError);
            }
            this.setState({ error: nextError });
        }
    }

    private _emitValid(value: number): void {
        const { onValid } = this.props;
        if(onValid !== undefined) {
            onValid(value);
        }
        this._emitError('none');
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

    private _validateValue(value: string): void {
        const { props } = this;
        const { showDefaultValue } = props;
        if(value === undefined) {
            return;
        }
        if(value === '') {
            if(showDefaultValue !== undefined) {
                this._emitError('required');
            }
        } else {
            if(value.match(/^(\-|\.|\d)+$/)) {
                if(value.match(/^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/)) {
                    if(value.match(/^-?((0(\.\d+)?)|([1-9]\d{0,}(\.\d+)?))$/)) {
                        const numberValue: number = Number(value);
                        switch(this._validateNumberValue(numberValue)) {
                            case 1:
                                this._emitError('max');
                                break;
                            case -1:
                                this._emitError('min');
                                break;
                            default:
                                this._emitValid(numberValue);
                                break;
                        }
                    } else {
                        this._emitError('incompleteNumber');
                    }
                } else {
                    const last: string = value[value.length - 1];
                    let error: NumberInputError;
                    switch(last) {
                        case '-':
                            error = 'singleMinus';
                            break;
                        case '.':
                            error = 'singleFloatingPoint';
                            break;
                        default:
                            error = 'singleZero';
                            break;
                    }
                    this._emitError(error);
                }
            } else {
                this._emitError('invalidSymbol');
            }
        }
    }
    
    private _handleKeyDown(event: React.KeyboardEvent): void {
        const { key } = event;
        const { value, onKeyDown } = this.props;
        if(key.match(/^(\d|\.|\-|..+)$/)) {
            if(onKeyDown !== undefined) {
                onKeyDown(event);
            }
        } else {
            event.preventDefault();
        }
    }

    private _handleChange(event: React.FormEvent): void {
        const eventValue: EventValue = event;
        const { value } = eventValue.target;
        const { onChange, value: propsValue } = this.props;
        if(onChange !== undefined) {
            onChange(event, value);
        }
        if(propsValue === undefined) {
            this._validateValue(value);
        }
    }

    private _handleBlur(event: React.FocusEvent): void {
        
    }

    public getInputNode(): Element {
        return this.textField.getInputNode();
    }

    public constructor(props: NumberInputProps) {
        super(props);
        this.state = { error: undefined };
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._onChange = this._handleChange.bind(this);
        this._onBlur = this._handleBlur.bind(this);
    }

    public componentDidMount(): void {
        this._validateValue(this.props.value);
    }

    public componentWillReceiveProps(props: NumberInputProps) {
        const { value } = props;
        if(value !== this.props.value) {
            this._validateValue(props.value);
        }
    }

    public render(): JSX.Element {
        const { props, state, _onKeyDown, _onChange, _onBlur } = this;
        const { value, showDefaultValue } = props;
         const { error } = state;
        let clonedProps: NumberInputProps = Object.assign({}, props);
        let newValue: string = error !== 'required' ? value : (showDefaultValue !== undefined ? String(showDefaultValue) : value);
        if(clonedProps.showDefaultValue !== undefined) {
            delete clonedProps.showDefaultValue;
        }
        if(clonedProps.onError !== undefined) {
            delete clonedProps.onError;
        }
        if(clonedProps.onValid !== undefined) {
            delete clonedProps.onValid;
        }
        return React.cloneElement(<TextField />, Object.assign(clonedProps, {
            type: 'text',
            value: newValue,
            onKeyDown: _onKeyDown,
            onChange: _onChange,
            onBlur: _onBlur,
            ref: (textField: TextField) => {
                this.textField = textField;
            }
        }));
    }
}

export default NumberInput;