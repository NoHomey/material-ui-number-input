import * as React from 'react';
import TextField from 'material-ui/TextField';
import ObjectAssign = require('object-assign');
import bind from 'bind-decorator';

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

export class NumberInput extends React.Component<NumberInputProps, void> {
    private static getValidValue(value: string): string {
        const emptyString: string = '';
        const match: RegExpMatchArray = value.match(NumberInput.allowed);
        return match !== null ? (match.index === 0 ? match[0] : match.join(emptyString)) : emptyString;
    }

    private static deleteOwnProps(props: any): void {
        NumberInput.deleteProps.forEach((prop: string): void => {
            if(props.hasOwnProperty(prop)) {
                delete props[prop];
            }
        });
    }

    private static validSymbols: RegExp = /(\-|\.|\d)+/;
    private static stricAllowed: RegExp = /^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/;
    private static validNumber: RegExp = /^-?((0(\.\d+)?)|([1-9]\d{0,}(\.\d+)?))$/;
    private static allowed: RegExp = /-?((0|([1-9]\d{0,}))(\.\d{0,})?)?/;
    private static deleteProps: Array<string> = ['strategy', 'onError', 'onValid', 'onRequestValue'];

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
    private error: NumberInputErrorExtended;
    private lastValid: string;
    private constProps: Object;
    private requestedValue: string;

    private emitEvents(nextError: NumberInputErrorExtended, value: string, emitError: boolean, valid: boolean): void {
        const { onError, onValid, strategy } = this.props;
        if((this.error !== nextError) && emitError) {
            if(onError) {
                onError(nextError as NumberInputError);
            }
            this.error = nextError;
        }
        if((nextError === 'none') && onValid && (this.lastValid !== value) && valid) {
            onValid(Number(value));
            this.lastValid = value;
        }
    }

    private validateNumberValue(value: number): number {
        const { max, min } = this.props;
        if((typeof max === 'number') && (value > max)) {
            return 1;
        }
        if((typeof min === 'number') && (value < min)) {
            return -1;
        }
        return 0;
    }

    private validateValue(value: string): NumberInputErrorExtended {
        const { props } = this;
        const { required, strategy, min } = props;
        if(value === '') {
            return required ? 'required' : 'clean';
        } else {
            if(value.match(NumberInput.validSymbols)) {
                if(value.match(NumberInput.stricAllowed)) {
                    if(value.match(NumberInput.validNumber)) {
                        const numberValue: number = Number(value);
                        const floatingPoint: number = value.indexOf('.');
                        const decimal: boolean = floatingPoint > -1;
                        const whole: number = decimal ? Number(value.substring(0, floatingPoint)) : min;
                        switch(this.validateNumberValue(numberValue)) {
                            case 1: return 'max';
                            case -1: return ((strategy !== 'allow') && (min > 0) && (numberValue >= 0) && (!decimal || (decimal && (whole > min)))) ? 'allow' : 'min';
                            default: return 'none';
                        }
                    } else {
                        return (strategy !== 'allow') && (value === '-') && (min >= 0) ? 'limit' : 'incompleteNumber';
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

    private overrideRequestedValue(error: string, value: string): string {
        const { strategy, min, max } = this.props;
        switch(error) {
            case 'min': return String(min);
            case 'max': return String(max);
            default: return strategy !== 'allow' && value === '-' ? '' : value; 
        }
    }

    private overrideError(error: string): string {
        switch(error) {
            case 'allow': return 'none';
            case 'limit': return this.props.required ? 'required' : 'clean';
            default: return error;
        }
    }

    private emitValid(error: string, valid: string): boolean {
        return error !== 'allow';
    }

    private takeActionForValue(value: string): void {
        const { strategy, onRequestValue, min, max, value: propsValue } = this.props;
        const error: NumberInputErrorExtended = this.validateValue(value);
        const valid: string = this.overrideRequestedValue(error, NumberInput.getValidValue(value));
        const emitError: boolean = (this.requestedValue !== value) && (strategy !== 'ignore');
        this.emitEvents(this.overrideError(error) as NumberInputErrorExtended, valid, emitError, this.emitValid(error, valid));
        if((strategy !== 'allow') && (valid !== value)) {
            this.requestedValue = valid;
            if(typeof propsValue !== 'string') {
                this.getInputNode().value = valid;
            } else if(onRequestValue) {
                onRequestValue(valid);
            }
        }
    }

    @bind
    private refTextField(textField: TextField): void {
        this.textField = textField;
    } 

    @bind
    private onChange(event: React.FormEvent): void {
        const eventValue: EventValue = event;
        const { value } = eventValue.target;
        const { onChange } = this.props;
        if(onChange) {
            onChange(event, value);
        }
        if(typeof this.props.value !== 'string') {
            this.takeActionForValue(value);
        }
    }

    @bind
    private onBlur(event: React.FocusEvent): void {
        const eventValue: EventValue = event;
        const { strategy, onBlur } = this.props;
        const { value } = eventValue.target;
        if(strategy === 'warn') {
            this.emitEvents(this.validateValue(value), value, true, false);
        }
        if(onBlur) {
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
        this.constProps = {
            type: 'text',
            onChange: this.onChange,
            onBlur: this.onBlur,
            ref: this.refTextField
        };
    }

    public componentDidMount(): void {
        const { value } = this.props;
        this.takeActionForValue(typeof value === 'string' ? value : this.getInputNode().value);
    }

    public componentWillReceiveProps(props: NumberInputProps): void {
        const { value } = props;
        if(value !== this.props.value) {
            this.takeActionForValue(value);
        }
    }

    public render(): JSX.Element {
        const { props, constProps } = this;
        const { value, defaultValue } = props;
        let inputProps: any = ObjectAssign({}, props, constProps, {
            defaultValue: typeof defaultValue === 'number' ? String(defaultValue) : undefined, 
            value: value,
        });
        if(typeof inputProps.value !== 'string') {
            delete inputProps.value;
        }
        if(inputProps.defaultValue === undefined) {
            delete inputProps.defaultValue;
        }
        NumberInput.deleteOwnProps(inputProps);
        return <TextField {...inputProps} />;
    }
}

export default NumberInput;