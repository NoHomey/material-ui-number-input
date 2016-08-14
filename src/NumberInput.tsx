import * as React from 'react';
import TextField from 'material-ui/TextField';
import * as DeepEqual from 'deep-equal';

export type NumberInputError = 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus' | 'singleFloatingPoint' | 'singleZero' | 'min' | 'max' | 'required';

export type NumberInputChangeHandler = (event: React.FormEvent, value: string, complete: boolean) => void;

export type NumberInputErrorHandler = (error: NumberInputError) => void;

export interface NumberInputPropsDeepEqual {

}

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
    error?: NumberInputError;
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
    onFocus?: React.FocusEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
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

export class NumberInput extends React.Component<NumberInputProps, void> {
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
        value: React.PropTypes.string,
        error: React.PropTypes.oneOf(['none', 'invalidSymbol', 'incompleteNumber', 'singleMinus', 'singleFloatingPoint', 'singleZero', 'min', 'max', 'required'])
    };
    public static defaultProps: NumberInputProps = {
        required: false,
        value: '',
        error: 'none',
    };
    private _onKeyDown: React.KeyboardEventHandler;
    private _onBlur: React.FocusEventHandler;

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

    private _emitError(nextError: NumberInputError): void {
        const { error, onError } = this.props;
        if((onError !== undefined) && (error !== nextError)) {
            onError(nextError);
        }
    }

    private _emitChange(event: React.FormEvent, value: string, complete: boolean): void {
        const { onChange } = this.props;
        if(onChange !== undefined) {
            onChange(event, value, complete);
        }
        this._emitError('none');
    }
    
    private _handleKeyDown(event: React.KeyboardEvent): void {
        const { key } = event;
        const { value, onKeyDown } = this.props;
        const canCallOnKeyDown: boolean = onKeyDown !== undefined;
        let eventValue: EventValue = getChangeEvent(event);
        if(key.match(/^(Backspace|.)$/)) {
            event.preventDefault();
        } else {
            if(canCallOnKeyDown) {
                onKeyDown(event);
            }
            return;
        }
        if(key.match(/^(\d|\.|\-|..+)$/)) {
            let valueChange: number;
            let newValue: string;
            if(key === 'Backspace') {
                newValue = value.substring(0, value.length - 1);
            } else if(key.length === 1) {
                newValue = value + key;
            }
            if(newValue !== undefined) {
                if(newValue.match(/^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/)) {
                    const complete: boolean = newValue.match(/^-?((0(\.\d+)?)|([1-9]\d{0,}(\.\d+)?))$/) !== null;
                    eventValue.target.value = newValue;
                    if(canCallOnKeyDown)  {
                        onKeyDown(event);
                    }
                    this._emitChange(eventValue as React.FormEvent, newValue, complete);
                    if(complete) {
                        valueChange = Number(newValue);
                        switch(this._validateValue(valueChange)) {
                            case 1:
                                this._emitError('max');
                                break;
                            case -1:
                                this._emitError('min');
                                break;
                        }
                    } else if(newValue !== '') {
                        this._emitError('incompleteNumber');
                    }
                } else {
                    const last: string = newValue[newValue.length - 1];
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
            } else if(key === 'Backspace') {
                newValue = '';
                eventValue.target.value = newValue;
                this._emitChange(eventValue as React.FormEvent, newValue, false);
            }
        } else {
            this._emitError('invalidSymbol');
        }
    }

    private _handleBlur(event: React.FocusEvent): void {
        const { showDefaultValue, onBlur, errorText, required, value: oldValue } = this.props;
        let value: string = oldValue;
        let newValue: string;
        if(value === '-') {
            value = '';
        } else {
            const last: number = value.length - 1;
            if(value[last] === '.') {
                newValue = value.substring(0, last);
            }
        }
        if((value === '') && (showDefaultValue !== undefined)) {
            newValue = String(showDefaultValue);
        }
        const newValueDefined: boolean = newValue !== undefined;
        let numberValue: number;
        let targetValue: string;
        let error: NumberInputError;
        if(newValueDefined) {
            numberValue = Number(newValue);
            targetValue = newValue;
        } else {
            newValue = '';
            numberValue = Number(oldValue);
            targetValue = value;
        }
        switch(this._validateValue(numberValue)) {
            case 1:
                error = 'max';
                break;
            case -1:
                error = 'min';
                break;
            default:
                if((value === '') && (newValue === '') && required) {
                    error = 'required';
                }
                break;
        }
        if(onBlur !== undefined) {
            let blurEvent: EventValue = event;
            blurEvent.target.value = targetValue;
            onBlur(blurEvent as React.FocusEvent);
        }
        if(error !== undefined) {
            this._emitError(error);
        } else {
            if(newValueDefined) {
                let eventValue: EventValue = getChangeEvent(event);
                eventValue.target.value = newValue;
                this._emitChange(eventValue as React.FormEvent, newValue, true);
            } else {
                this._emitError('none');
            }
        }
    }

    public constructor(props: NumberInputProps) {
        super(props);
        this._onKeyDown = this._handleKeyDown.bind(this);
        this._onBlur = this._handleBlur.bind(this);
    }

    public render(): JSX.Element {
        const { props, _onKeyDown, _onBlur } = this;
        let clonedProps: NumberInputProps = Object.assign({}, props);
        const { error, value, showDefaultValue } = props;
        if(clonedProps.showDefaultValue !== undefined) {
            delete clonedProps.showDefaultValue;
        }
        if(clonedProps.error !== undefined) {
            delete clonedProps.error;
        }
        if(clonedProps.onError !== undefined) {
            delete clonedProps.onError;
        }
        return React.cloneElement(<TextField />, Object.assign(clonedProps, {
            type: 'text',
            value: error !== 'required' ? value : (showDefaultValue !== undefined ? String(showDefaultValue) : value),
            onKeyDown: _onKeyDown,
            onBlur: _onBlur
        }));
    }
}

export default NumberInput;