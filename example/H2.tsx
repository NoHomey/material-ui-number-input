import * as React from 'react';

interface H2Props {
    id: string;
    label: string;
}

export default function H2(props: H2Props): JSX.Element {
    return (
        <h2>
            <a id={props.id} className="anchor" href={`#${props.id}`} aria-hidden="true">
                <span aria-hidden="true" className="octicon octicon-link" />
            </a>
            {props.label}
        </h2>
    );
}