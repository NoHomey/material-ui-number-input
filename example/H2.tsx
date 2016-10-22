import * as React from 'react';

interface H2Props {
    id: string;
    label: string;
}

export default class H2 extends React.PureComponent<H2Props, void> {
    public constructor(props: H2Props) {
        super(props);
    }

    public render(): JSX.Element {
        const { id, label } = this.props;
        return (
            <h2>
                <a id={id} className="anchor" href={`#${id}`} aria-hidden="true">
                    <span aria-hidden="true" className="octicon octicon-link" />
                </a>
                {label}
            </h2>
        );
    }
}