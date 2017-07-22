import * as React from 'react';
import TextField from 'material-ui/TextField';
import ObjectAssign = require('object-assign');
import bind from 'bind-decorator';

export type NumberInputError = 'none' | 'invalidSymbol' | 'incompleteNumber' | 'singleMinus'
    | 'singleFloatingPoint' | 'singleZero'| 'min' | 'max' | 'required' | 'clean';

export type NumberInputChangeHandler = (event: React.FormEvent<{}>, value: string) => void;

export type NumberInputValidHandler = (valid: number) => void;

export type NumberInputErrorHandler = (error: NumberInputError) => void;

export type NumberInputReqestValueHandller = (value: string) => void;

export interface NumberInputProps {
    className?: string;
    disabled?: boolean;
    floatingLabelFixed?: boolean;
    id?: string;
    inputMode?: string;
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
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: NumberInputChangeHandler;
    onError?: NumberInputErrorHandler;
    onValid?: NumberInputValidHandler;
    onRequestValue?: NumberInputReqestValueHandller;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export type NumberInputErrorExtended = NumberInputError | 'limit' | 'allow';

namespace errorNames {
    export const none: 'none' = 'none';
    export const invalidSymbol: 'invalidSymbol' = 'invalidSymbol';
    export const incompleteNumber: 'incompleteNumber' = 'incompleteNumber';
    export const singleMinus: 'singleMinus' = 'singleMinus';
    export const singleFloatingPoint: 'singleFloatingPoint' = 'singleFloatingPoint';
    export const singleZero: 'singleZero' = 'singleZero';
    export const min: 'min' = 'min';
    export const max: 'max' = 'max';
    export const required: 'required' = 'required';
    export const clean: 'clean' = 'clean';
    export const allow: 'allow' = 'allow';
    export const limit: 'limit' = 'limit';
}

namespace strategies {
    export const ignore: 'ignore' = 'ignore';
    export const warn: 'warn' = 'warn';
    export const allow: 'allow' = 'allow';
}

namespace typeofs {
    export const stringType: string = 'string';
    export const numberType: string = 'number';
}

namespace constants {
    export const emptyString: string = '';
    export const dash: string = '-';
    export const dot: string = '.';
    export const zero: number = 0;
    export const one: number = 1;
    export const text: string = 'text';
    export const zeroString: string = '0';
    export const minusOne: number = -1;
    export const boolTrue: boolean = true;
    export const boolFalse: boolean = false;
}

export class NumberInput extends React.Component<NumberInputProps, Object> {
    private static getValidValue(value: string): string {
        const match: RegExpMatchArray | null = value.match(NumberInput.allowed);
        return match !== null ? (match.index === constants.zero ? match[constants.zero] : match.join(constants.emptyString)) : constants.emptyString;
    }

    private static deleteOwnProps(props: any): void {
        let prop: string;
        for(let index: number = 0; index < NumberInput.deleteProps.length; ++index) {
            prop = NumberInput.deleteProps[index];
            if(props.hasOwnProperty(prop)) {
                delete props[prop];
            }
        }
    }

    private static validateNumberValue(value: number, props: NumberInputProps): number {
        const { max, min } = props;
        if((typeof max === typeofs.numberType) && (value > max!)) {
            return constants.one;
        }
        if((typeof min === typeofs.numberType) && (value < min!)) {
            return constants.minusOne;
        }
        return constants.zero;
    }

    private static validateValue(value: string, props: NumberInputProps): NumberInputErrorExtended {
        const { required, strategy, min } = props;
        if(value === constants.emptyString) {
            return required ? errorNames.required : errorNames.clean;
        } else {
            if(value.match(NumberInput.validSymbols)) {
                if(value.match(NumberInput.stricAllowed)) {
                    if(value.match(NumberInput.validNumber)) {
                        const numberValue: number = Number(value);
                        const floatingPoint: number = value.indexOf(constants.dot);
                        const decimal: boolean = floatingPoint > constants.minusOne;
                        const whole: number = decimal ? Number(value.substring(constants.zero, floatingPoint)) : min!;
                        switch(NumberInput.validateNumberValue(numberValue, props)) {
                            case constants.one: return errorNames.max;
                            case constants.minusOne: return ((strategy !== strategies.allow) && (min! > constants.zero) && (numberValue > constants.zero) && (!decimal || (decimal && (whole > min!)))) ? errorNames.allow : errorNames.min;
                            default: return errorNames.none;
                        }
                    } else {
                        return (strategy !== strategies.allow) && (value === constants.dash) && (min! >= constants.zero)
                            ? errorNames.limit : (min! < 0 ? errorNames.allow : errorNames.incompleteNumber);
                    }
                } else {
                    switch(value[value.length - constants.one]) {
                        case constants.dash: return errorNames.singleMinus;
                        case constants.dot: return errorNames.singleFloatingPoint;
                        case constants.zeroString: return errorNames.singleZero;
                        default : return errorNames.invalidSymbol;
                    }
                }
            } else {
                return errorNames.invalidSymbol;
            }
        }
    }

    private static overrideRequestedValue(error: string, value: string, props: NumberInputProps): string {
        switch(error) {
            case errorNames.min: return String(props.min);
            case errorNames.max: return String(props.max);
            default: return props.strategy !== strategies.allow && value === constants.dash && props.min! >= 0 ? constants.emptyString : value; 
        }
    }

    private static overrideError(error: NumberInputErrorExtended, props: NumberInputProps): NumberInputError {
        switch(error) {
            case errorNames.allow: return errorNames.none;
            case errorNames.limit: return props.required ? errorNames.required : errorNames.clean;
            default: return error;
        }
    }

    private static revertAllowToMin(error: NumberInputErrorExtended): NumberInputErrorExtended {
        return error === errorNames.allow ? errorNames.min : error;
    }

    private static emitValid(error: string, overridenError: string): boolean {
        return (error !== errorNames.allow) && (overridenError === errorNames.none);
    }

    private static validSymbols: RegExp = /(\-|\.|\d)+/;
    private static stricAllowed: RegExp = /^-?((0|([1-9]\d{0,}))(\.\d{0,})?)?$/;
    private static validNumber: RegExp = /^-?((0(\.\d+)?)|([1-9]\d{0,}(\.\d+)?))$/;
    private static allowed: RegExp = /-?((0|([1-9]\d{0,}))(\.\d{0,})?)?/;
    private static deleteProps: Array<string> = ['strategy', 'onError', 'onValid', 'onRequestValue'];

    public static propTypes: React.ValidationMap<NumberInputProps> = {
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
        inputMode: React.PropTypes.string,
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
        strategy: React.PropTypes.oneOf([
            strategies.ignore,
            strategies.warn,
            strategies.allow
        ]),
        value: React.PropTypes.string
    };
    public static defaultProps: NumberInputProps = {
        required: constants.boolFalse,
        strategy: strategies.allow
    };
    public textField: TextField;
    private error: NumberInputErrorExtended;
    private lastValid: string;
    private constProps: Object;

    private emitEvents(nextError: NumberInputErrorExtended, value: string, valid: boolean, props: NumberInputProps): void {
        const { onError, onValid } = props;
        if((this.error !== nextError) && (props.strategy !== strategies.ignore)) {
            if(onError) {
                onError(nextError as NumberInputError);
            }
            this.error = nextError;
        }
        if(onValid && valid && (this.lastValid !== value)) {
            onValid(Number(value));
            this.lastValid = value;
        }
    }

    private takeActionForValue(value: string, props: NumberInputProps): void {
        const { strategy, onRequestValue, value: propsValue } = props;
        const error: NumberInputErrorExtended = NumberInput.validateValue(value, props);
        const valid: string = NumberInput.overrideRequestedValue(error, NumberInput.getValidValue(value), props);
        const overridenError: NumberInputError = NumberInput.overrideError(error, props);
        const emitValid: boolean = NumberInput.emitValid(error, overridenError);
        this.emitEvents(overridenError, valid, emitValid, props);
        if((strategy !== strategies.allow) && (valid !== value)) {
            if(typeof propsValue !== typeofs.stringType) {
                this.getInputNode().value = valid;
            } else if(onRequestValue) {
                onRequestValue(valid);
            }
        }
    }

    private shouldTakeActionForValue(props: NumberInputProps): boolean {
        const { min, max, required, strategy } = this.props;
        return (min !== props.min) || (max !== props.max) || (required !== props.required) || (strategy !== props.strategy);
    }

    @bind
    private refTextField(textField: TextField): void {
        this.textField = textField;
    } 

    @bind
    private onChange(event: React.FormEvent<HTMLInputElement>): void {
        const { value } = event.currentTarget;
        const { onChange } = this.props;
        if(onChange) {
            onChange(event, value!);
        }
        if(typeof this.props.value !== typeofs.stringType) {
            this.takeActionForValue(value!, this.props);
        }
    }

    @bind
    private onBlur(event: React.FocusEvent<HTMLInputElement>): void {
        const { value } = event.currentTarget;
        const { props } = this;
        const { onBlur } = props;
        const error: NumberInputError = NumberInput.overrideError(NumberInput.revertAllowToMin(NumberInput.validateValue(value!, props)), props);
        this.emitEvents(error, value!, constants.boolFalse, props);
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
            type: constants.text,
            onChange: this.onChange,
            onBlur: this.onBlur,
            ref: this.refTextField
        };
    }

    public componentDidMount(): void {
        const { props } = this;
        const { value } = props;
        this.takeActionForValue(typeof value === typeofs.stringType ? value! : this.getInputNode().value, props);
    }

    public componentWillReceiveProps(props: NumberInputProps): void {
        const { value } = props;
        if((value !== this.props.value) || this.shouldTakeActionForValue(props)) {
            this.takeActionForValue(value!, props);
        }
    }

    public render(): JSX.Element {
        const { props, constProps } = this;
        const { value, defaultValue } = props;
        let inputProps: any = ObjectAssign({}, props, constProps, {
            defaultValue: typeof defaultValue === typeofs.numberType ? String(defaultValue) : undefined, 
            value: value,
        });
        if(typeof inputProps.value !== typeofs.stringType) {
            delete inputProps.value;
        }
        if(inputProps.defaultValue === undefined) {
            delete inputProps.defaultValue;
        }
        NumberInput.deleteOwnProps(inputProps);
        return React.createElement(TextField, inputProps);
    }
}

export default NumberInput;