import * as React from 'react';
import { SourceCode, javascript, typescript } from './SourceCode';
import { StrategySelectField, Strategy, allow } from './StrategySelectField';
import LimitInput from './LimitInput';
import RequiredCheckbox from './RequiredCheckbox';
import ColoredButton from './ColoredButton';
import FlatButton from 'material-ui/FlatButton';
import If from './If';
import H2 from './H2';
import { orange500, red500 } from 'material-ui/styles/colors';
import { NumberInput, NumberInputError } from 'material-ui-number-input';
import bind from 'bind-decorator';

const allProps: Array<string> = ['value', 'onChange', 'onValid', 'onRequestValue', 'errorText', 'errorStyle', 'onError', 'strategy', 'min', 'max', 'required']; 

function serializeProp(prop: string, value: any): string {
    return value === true ? prop : `${prop}=${value[0] !== '"' ? `{${value}}` : value + '"'}`;
}

function reactiveProps(props: Object): string {
    let dynamicProps: string = '';
    let value: any;
    for(let prop of allProps) {
        value = (props as any)[prop];
        if(value !== null) {
            dynamicProps += `                ${serializeProp(prop, value)}\n`;
        }
    }
    return dynamicProps;
}

function code(language: string, props: any, strategy: Strategy): string {
const types: boolean = language === typescript;
const isStrategyAllow: boolean = strategy === 'allow';
const isStrategyWarn: boolean = strategy === 'warn';
const isStrategyNotIngore: boolean = isStrategyAllow || isStrategyWarn;
const importOrangeColorIfWarn: string = isStrategyWarn ? '\nimport { orange500 } from \'material-ui/styles/colors\';' : '';
return `import * as React from 'react';
import ${types ? '{ NumberInput, NumberInputError }' : 'NumberInput'} from 'material-ui-number-input';${importOrangeColorIfWarn}
import bind from 'bind-decorator';
${types ?
`
interface DemoState {
    value?: string;
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

    ${types ? 'private ' : ''}onValid(valid${types ? ': number' : ''})${types ? ': void' : ''} {
        alert(valid);
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
        this.state = { value: ''${isStrategyNotIngore ? `, errorText: ''` : ''} };
    }

    ${types ? 'public ' : ''}render()${types ? ': JSX.Element' : ''} {
        const { value, errorText } = this.state;
        return (
            <NumberInput
${reactiveProps(props)}            />
        );
    }
}`;
}

interface HandlerCalled {
    onChange: boolean;
    onError: boolean;
    onValid: boolean;
    onRequestValue: boolean;
}

interface ReactiveExampleState {
    value?: string;
    error?: NumberInputError;
    language?: string;
    strategy?: Strategy;
    props?: any;
    handlerCalled?: HandlerCalled;
}

export default class ReactiveExample extends React.Component<void, ReactiveExampleState> {
    @bind
    private onChange(event: React.FormEvent<{}>, value: string): void {
        const { handlerCalled } = this.state;
        handlerCalled!.onChange = true;
        this.setState({ value: value, handlerCalled: handlerCalled });
    }

    @bind
    private onValid(valid: number): void {
        alert(valid);
        const { handlerCalled } = this.state;
        handlerCalled!.onValid = true;
        this.setState({ handlerCalled: handlerCalled });
    }

    @bind
    private onRequestValue(value: string): void {
        const { handlerCalled } = this.state;
        handlerCalled!.onRequestValue = true;
        this.setState({ value: value, handlerCalled: handlerCalled });
    }

    @bind
    private onError(error: NumberInputError): void {
        const { handlerCalled } = this.state;
        handlerCalled!.onError = true;
        this.setState({ error: error, handlerCalled: handlerCalled });
    }

    @bind
    private onLangaugeChange(language: string): void {
        this.setState({ language: language });
    }

    @bind
    private onStrategyChange(strategy: Strategy): void {
        const { props } = this.state;
        const isStrategyIgnore: boolean = strategy === 'ignore';
        const isStrategyWarn: boolean = strategy === 'warn';
        const isStrategyAllow: boolean = strategy === 'allow';
        props.strategy = '"' + strategy;
        props.errorText = isStrategyIgnore ? null : 'errorText';
        props.onError = isStrategyIgnore ? null : 'this.onError';
        props.onRequestValue = isStrategyAllow ? null : 'this.onRequestValue';
        props.errorStyle = isStrategyWarn ? '{ color: orange500 }' : null;
        this.setState({ strategy: strategy, props: props });
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
        this.setState({
            handlerCalled: {
                onChange: false,
                onError: false,
                onValid: false,
                onRequestValue: false
            }
        });
    }

    public constructor(props: void) {
        super(props);
        this.state = {
            value: '',
            language: javascript,
            strategy: allow,
            props: {
                min: 0,
                max: 30,
                value: 'value',
                onChange: 'this.onChange',
                onValid: 'this.onValid',
                onRequestValue: null,
                errorText: 'errorText',
                errorStyle: null,
                onError: 'this.onError',
                strategy: '"' + allow,
                required: true,
            },
            handlerCalled: {
                onChange: false,
                onError: false,
                onValid: false,
                onRequestValue: false
            }
        };
    }

    public render(): JSX.Element {
        const { value, error, language, strategy, props, handlerCalled } = this.state;
        const isStrategyAllow: boolean = strategy === 'allow';
        const isStrategyWarn: boolean = strategy === 'warn';
        const isStrategyNotIngore: boolean = isStrategyAllow || isStrategyWarn;
        const isError: boolean = isStrategyNotIngore && (error !== 'none');
        const errorText: string = isError ? (isStrategyWarn ? 'Warning: ' : 'Error: ') + error : '';
        const errorStyle: React.CSSProperties = { color: isStrategyWarn ? orange500 : red500 };
        return (
            <div>
                <H2 id="react-ive-props" label="React-ive Props" />
                <div>
                    <StrategySelectField strategy={strategy!} onStrategyChange={this.onStrategyChange} />
                    <br />
                    <LimitInput limit="min" onValidLimit={this.onValidMin} onInvalidLimit={this.onInValidMin} />
                    <br />
                    <LimitInput limit="max" onValidLimit={this.onValidMax} onInvalidLimit={this.onInValidMax} />
                    <br />
                    <RequiredCheckbox required={Boolean(props.required)} onRequiredCheck={this.onRequiredCheck} />
                </div>
                <H2 id="number-input" label="NumberInput" />
                <NumberInput
                    id="reactive-number-input"
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
                <H2 id="called-handlers" label="Called Handlers" />
                <div>
                    <ColoredButton label="onChange" color="#9b59b6" colored={handlerCalled!.onChange} />
                    <If
                        condition={isStrategyNotIngore}
                        then={<ColoredButton label="onError" color="#ff5733" colored={handlerCalled!.onError} />} />
                    <ColoredButton label="onValid" color="#2ecc71" colored={handlerCalled!.onValid} />
                    <If
                        condition={!isStrategyAllow}
                        then={<ColoredButton label="onRequestValue" color="#f39c12" colored={handlerCalled!.onRequestValue} />} />
                    <FlatButton label="Clear" primary onClick={this.onClear} />
                </div>
                <H2 id="source-code" label="Source code" />
                <SourceCode
                    language={language!}
                    code={code(language!, props!, strategy!)}
                    onLanguageChange={this.onLangaugeChange} />
            </div>
        );
    }
}