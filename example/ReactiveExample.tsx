import * as React from 'react';
import { SourceCode, javascript, typescript } from './SourceCode';
import bind from 'bind-decorator';
//import { NumberInputProps } from 'material-ui-number-input';

function reactiveProps(props: Object): string {
    let dynamicProps: string = '';
    for(let prop in props) {
        if(props.hasOwnProperty(prop)) {
            dynamicProps += `                ${prop}={${(props as any)[prop]}}\n`;
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
    language: string;
}

export default class ReactiveExample extends React.Component<void, ReactiveExampleState> {
    @bind
    private onLangaugeChange(language: string): void {
        this.setState({ language: language });
    }

    public constructor(props: void) {
        super(props);
        this.state = { language: javascript };
    }

    public render(): JSX.Element {
        const { language } = this.state;
        const props: any = {
            min: 9,
            max: 30,
            value: 'value'
        };
        return (
            <div>
                <div>
                </div>
                <SourceCode
                    language={language}
                    code={code(language, props)}
                    onLanguageChange={this.onLangaugeChange} />
            </div>
        );
    }

}