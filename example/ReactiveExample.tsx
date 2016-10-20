import * as React from 'react';
import { SourceCode, javascript } from './SourceCode';
import bind from 'bind-decorator';

const typescriptCode: string =
`// Source code:
import * as React from 'react';

interface DemoState {
    value?: string;
    errorText?: string;
}

class Demo extends React.Component<void, DemoState> {
    public constructor(props: void) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <NumberInput
            

            />
        );
    }
}`;

const javascriptCode: string =
`// Source code:
import * as React from 'react';

class Demo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NumberInput
            

            />
        );
    }
}`;

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
        return (
            <SourceCode
                language={language}
                code={language === javascript ? javascriptCode : typescriptCode}
                onLanguageChange={this.onLangaugeChange} />
        );
    }

}