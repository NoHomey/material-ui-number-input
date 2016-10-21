import * as React from 'react';
import { SourceCode, javascript, typescript } from './SourceCode';
import { StrategySelectField, Strategy, allow } from './StrategySelectField';
import LimitInput from './LimitInput';
import RequiredCheckbox from './RequiredCheckbox';
import bind from 'bind-decorator';

const allProps: Array<string> = ['value', 'strategy', 'min', 'max', 'required']; 

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

function code(language: string, props: any): string {
const types: boolean = language === typescript;
return `import * as React from 'react';
${
types ?
`
interface DemoState {
    value?: string;
    errorText?: string;
}
` : ''
}
class Demo extends React.Component${types ? '<void, DemoState>' : ''} {
    public constructor(props${types ? ': void' : ''}) {
        super(props);
    }

    public render()${types ? ': JSX.Element' : ''} {
        return (
            <NumberInput
${reactiveProps(props)}            />
        );
    }
}`;
}

interface ReactiveExampleState {
    language?: string;
    strategy?: Strategy;
    props?: any;
}

export default class ReactiveExample extends React.Component<void, ReactiveExampleState> {
    @bind
    private onLangaugeChange(language: string): void {
        this.setState({ language: language });
    }

    @bind
    private onStrategyChange(strategy: Strategy): void {
        const { props } = this.state;
        props.strategy = '"' + strategy;
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

    public constructor(props: void) {
        super(props);
        this.state = {
            language: javascript,
            strategy: allow,
            props: {
                min: 0,
                max: 30,
                value: 'value',
                strategy: '"' + allow,
                required: true,
            }
        };
    }

    public render(): JSX.Element {
        const { language, strategy, props } = this.state;
        return (
            <div>
                <div>
                    <StrategySelectField strategy={strategy!} onStrategyChange={this.onStrategyChange} />
                    <br />
                    <LimitInput limit="min" onValidLimit={this.onValidMin} onInvalidLimit={this.onInValidMin} />
                    <br />
                    <LimitInput limit="max" onValidLimit={this.onValidMax} onInvalidLimit={this.onInValidMax} />
                    <br />
                    <RequiredCheckbox required={Boolean(props.required)} onRequiredCheck={this.onRequiredCheck} />
                </div>
                <SourceCode
                    language={language!}
                    code={code(language!, props!)}
                    onLanguageChange={this.onLangaugeChange} />
            </div>
        );
    }
}