import * as React from 'react';
import { SourceCode, javascript, typescript } from './SourceCode';
import { StrategySelectField, Strategy, allow } from './StrategySelectField';
import RequiredCheckbox from './RequiredCheckbox';
import bind from 'bind-decorator';
//import { NumberInput } from 'material-ui-number-input';

function serializeProp(prop: string, value: any): string {
    return value === true ? prop : `${prop}=${value[0] !== '"' ? `{${value}}` : value + '"'}`;
}

function reactiveProps(props: Object): string {
    let dynamicProps: string = '';
    for(let prop in props) {
        if(props.hasOwnProperty(prop)) {
            dynamicProps += `                ${serializeProp(prop, (props as any)[prop])}\n`;
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
            delete props.required;
        }
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
                <div style={{ display: 'inline' }}>
                    <StrategySelectField strategy={strategy!} onStrategyChange={this.onStrategyChange} />
                    <RequiredCheckbox required={props.required} onRequiredCheck={this.onRequiredCheck} />
                </div>
                <SourceCode
                    language={language!}
                    code={code(language!, props!)}
                    onLanguageChange={this.onLangaugeChange} />
            </div>
        );
    }
}