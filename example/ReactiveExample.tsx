import * as React from 'react';
import { SourceCode, javascript, typescript } from './SourceCode';
import { StrategySelectField, Strategy, allow } from './StrategySelectField';
import { CalledHandlersStack, CalledHandlers, handlers } from './CalledHandlers/CalledHandlers';
import LimitInput from './LimitInput';
import RequiredCheckbox from './RequiredCheckbox';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import H2 from './H2';
import { orange500, red500 } from 'material-ui/styles/colors';
import { NumberInput, NumberInputError } from 'material-ui-number-input';
import bind from 'bind-decorator';

namespace propsDefaults {
    export const errorText: string = 'errorText';
    export const onError: string = 'this.onError';
    export const onRequestValue: string = 'this.onRequestValue';
    export const errorStyle: string = '{ color: orange500 }';
}

namespace strategies {
    export const ignore: 'ignore' = 'ignore';
    export const warn: 'warn' = 'warn';
    export const allow: 'allow' = 'allow';
}

namespace errorTexts {
    export const warn: string = 'Warning: ';
    export const allow: string = 'Error: ';
}

namespace constProps {
    export const reactiveProps: string = 'react-ive-props';
    export const ReactIveProps: string = 'React-ive Props';
    export const min: string = 'min';
    export const max: string = 'max';
    export const numberInputDemo: string = 'number-input-demo';
    export const NumberInputDemo: string = 'NumberInput Demo';
    export const reactIveNumberInput: string = 'reactive-number-input';
    export const NumberInput: string = 'NumberInput';
    export const validNumberInput: string = 'valid-number-input';
    export const ValidNumber: string = 'Valid number';
    export const calledHandlers: string = 'called-handlers';
    export const CalledHandlers: string = 'Called Handlers';
    export const Clear: string = 'Clear';
    export const sourceCode: string = 'source-code';
    export const SourceCode: string = 'Source code';
}

namespace constants {
    export const none: 'none' = 'none';
    export const zero: number = 0;
    export const quote: string = '"';
}

const allProps: Array<string> = ['floatingLabelText' ,'value', 'onChange', 'onValid', 'onRequestValue', 'errorText', 'errorStyle', 'onError', 'strategy', 'min', 'max', 'required']; 

function serializeProp(prop: string, value: any): string {
    return value === true ? prop : `${prop}=${value[constants.zero] !== constants.quote ? `{${value}}` : value + constants.quote}`;
}

function reactiveProps(props: Object): string {
    let dynamicProps: string = '';
    let value: any;
    for(let prop of allProps) {
        value = (props as any)[prop];
        if(value !== null) {
            dynamicProps += `                    ${serializeProp(prop, value)}\n`;
        }
    }
    return dynamicProps;
}

function code(language: string, props: any, strategy: Strategy): string {
const types: boolean = language === typescript;
const isStrategyAllow: boolean = strategy === strategies.allow;
const isStrategyWarn: boolean = strategy === strategies.warn;
const isStrategyNotIngore: boolean = isStrategyAllow || isStrategyWarn;
const importOrangeColorIfWarn: string = isStrategyWarn ? '\nimport { orange500 } from \'material-ui/styles/colors\';' : '';
return `import * as React from 'react';
import ${types ? '{ NumberInput, NumberInputError }' : 'NumberInput'} from 'material-ui-number-input';${importOrangeColorIfWarn}
import bind from 'bind-decorator';
${types ?
`
interface DemoState {
    value?: string;
    valid?: number;
    errorText?: string;
}
` : ''
}
class Demo extends React.Component${types ? '<void, DemoState>' : ''} {
    ${types ? 'private ' : ''}setValue(value${types ? ': string' : ''})${types ? ': void' : ''} {
        this.setState({ value: value });
    }

    @bind
    ${types ? 'private ' : ''}onChange(event${types ? ': React.FormEvent<{}>' : ''}, value${types ? ': string' : ''})${types ? ': void' : ''} {
        this.setValue(value);
    }

    @bind
    ${types ? 'private ' : ''}onValid(valid${types ? ': number' : ''})${types ? ': void' : ''} {
        this.setState({ valid: valid });
    }${isStrategyAllow ? '' : '\n'}${!isStrategyAllow? `
    @bind
    ${types ? 'private ' : ''}onRequestValue(value${types ? ': string' : ''})${types ? ': void' : ''} {
        this.setValue(value);
    }${!isStrategyNotIngore ? '\n' : ''}` : ''
}
${isStrategyNotIngore ? `
    @bind
    ${types ? 'private ' : ''}onError(error${types ? ': NumberInputError' : ''})${types ? ': void' : ''} {
        this.setState({ errorText: error !== 'none' ? '${isStrategyWarn ? 'Warning' : 'Error'}: ' + error : '' });
    }

`: ''
}    ${types ? 'public ' : ''}constructor(props${types ? ': void' : ''}) {
        super(props);
        this.state = { value: '', valid: 0${isStrategyNotIngore ? `, errorText: ''` : ''} };
    }

    ${types ? 'public ' : ''}render()${types ? ': JSX.Element' : ''} {
        const { value, valid, errorText } = this.state;
        return (
            <div>
                <NumberInput
${reactiveProps(props)}                />
                <NumberInput value={String(valid)} floatingLabelText="Valid number" />
            </div>
        );
    }
}`;
}

interface ReactiveExampleState {
    value?: string;
    error?: NumberInputError;
    valid?: number;
    language?: string;
    strategy?: Strategy;
    props?: any;
    calledHandlersStack?: CalledHandlersStack;
}

export default class ReactiveExample extends React.Component<void, ReactiveExampleState> {
    @bind
    private onChange(event: React.FormEvent<{}>, value: string): void {
        const { calledHandlersStack } = this.state;
        calledHandlersStack!.push({ handler: handlers.onChange, argument: value });
        this.setState({ value: value, calledHandlersStack: calledHandlersStack });
    }

    @bind
    private onValid(valid: number): void {
        const { calledHandlersStack } = this.state;
        calledHandlersStack!.push({ handler: handlers.onValid, argument: String(valid) });;
        this.setState({ valid: valid, calledHandlersStack: calledHandlersStack });
    }

    @bind
    private onRequestValue(value: string): void {
        const { calledHandlersStack } = this.state;
        calledHandlersStack!.push({ handler: handlers.onRequestValue, argument: value });
        this.setState({ value: value, calledHandlersStack: calledHandlersStack });
    }

    @bind
    private onError(error: NumberInputError): void {
        const { calledHandlersStack } = this.state;
        calledHandlersStack!.push({ handler: handlers.onError, argument: error });
        this.setState({ error: error, calledHandlersStack: calledHandlersStack });
    }

    @bind
    private onLangaugeChange(language: string): void {
        this.setState({ language: language });
    }

    @bind
    private onStrategyChange(strategy: Strategy): void {
        const { props } = this.state;
        const isStrategyIgnore: boolean = strategy === strategies.ignore;
        const isStrategyWarn: boolean = strategy === strategies.warn;
        const isStrategyAllow: boolean = strategy === strategies.allow;
        props.strategy = constants.quote + strategy;
        props.errorText = isStrategyIgnore ? null : propsDefaults.errorText;
        props.onError = isStrategyIgnore ? null : propsDefaults.onError;
        props.onRequestValue = isStrategyAllow ? null : propsDefaults.onRequestValue;
        props.errorStyle = isStrategyWarn ? propsDefaults.errorStyle : null;
        this.setState({ strategy: strategy, props: props, calledHandlersStack: [], valid: constants.zero });
    }

    @bind
    private onRequiredCheck(required: boolean): void {
        const { props } = this.state;
        if(required) {
            props.required = required
        } else {
            props.required = null;
        }
        this.setState({ props: props });
    }

    @bind
    private onValidMin(min: number): void {
        const { props } = this.state;
        props.min = min;
        this.setState({ props: props });
    }

    @bind
    private onInValidMin(): void {
        const { props } = this.state;
        props.min = null;
        this.setState({ props: props });
    }

    @bind
    private onValidMax(max: number): void {
        const { props } = this.state;
        props.max = max;
        this.setState({ props: props });
    }

    @bind
    private onInValidMax(): void {
        const { props } = this.state;
        props.max = null;
        this.setState({ props: props });
    }

    @bind
    private onClear(): void {
        this.setState({ calledHandlersStack: [] });
    }

    public constructor(props: void) {
        super(props);
        this.state = {
            value: '',
            valid: constants.zero,
            language: javascript,
            strategy: allow,
            props: {
                floatingLabelText: constants.quote + constProps.NumberInput,
                min: -Infinity,
                max: Infinity,
                value: 'value',
                onChange: 'this.onChange',
                onValid: 'this.onValid',
                onRequestValue: null,
                errorText: propsDefaults.errorText,
                errorStyle: null,
                onError: 'this.onError',
                strategy: constants.quote + allow,
                required: true,
            },
            calledHandlersStack: []
        };
    }

    public shouldCompoenetUpdate(props: void, state: ReactiveExampleState): boolean {
        return JSON.stringify(this.state) !== JSON.stringify(state);
    }

    public render(): JSX.Element {
        const { value, error, valid, language, strategy, props, calledHandlersStack } = this.state;
        const isStrategyAllow: boolean = strategy === strategies.allow;
        const isStrategyWarn: boolean = strategy === strategies.warn;
        const isStrategyNotIngore: boolean = isStrategyAllow || isStrategyWarn;
        const isError: boolean = isStrategyNotIngore && (error !== constants.none);
        const errorText: string = isError ? (isStrategyWarn ? errorTexts.warn : errorTexts.allow) + error : '';
        const errorStyle: React.CSSProperties = { color: isStrategyWarn ? orange500 : red500 };
        return (
            <MuiThemeProvider>
                <div>
                    <H2 id={constProps.reactiveProps} label={constProps.ReactIveProps} />
                    <div>
                        <StrategySelectField strategy={strategy!} onStrategyChange={this.onStrategyChange} />
                        <br />
                        <LimitInput limit={constProps.min} onValidLimit={this.onValidMin} onInvalidLimit={this.onInValidMin} />
                        <br />
                        <LimitInput limit={constProps.max} onValidLimit={this.onValidMax} onInvalidLimit={this.onInValidMax} />
                        <br />
                        <RequiredCheckbox required={Boolean(props.required)} onRequiredCheck={this.onRequiredCheck} />
                    </div>
                    <H2 id={constProps.numberInputDemo} label={constProps.NumberInputDemo} />
                    <div>
                        <NumberInput
                            id={constProps.reactIveNumberInput}
                            floatingLabelText={constProps.NumberInput}
                            value={value}
                            strategy={strategy}
                            required={props.required}
                            min={props.min}
                            max={props.max}
                            onChange={this.onChange}
                            onValid={this.onValid}
                            onRequestValue={this.onRequestValue}
                            errorText={errorText}
                            onError={this.onError}
                            errorStyle={errorStyle} />
                        <NumberInput id={constProps.validNumberInput} floatingLabelText={constProps.ValidNumber} value={String(valid)} />
                    </div>
                    <H2 id={constProps.calledHandlers} label={constProps.CalledHandlers} />
                    <div>
                        <CalledHandlers calledHandlers={calledHandlersStack!} />
                        <FlatButton label={constProps.Clear} primary onClick={this.onClear} disabled={calledHandlersStack!.length === 0} />
                    </div>
                    <H2 id={constProps.sourceCode} label={constProps.SourceCode} />
                    <SourceCode
                        language={language!}
                        code={code(language!, props!, strategy!)}
                        onLanguageChange={this.onLangaugeChange} />
                </div>
            </MuiThemeProvider>
        );
    }
}