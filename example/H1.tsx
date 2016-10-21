import * as React from 'react';

interface H1Props {
    id: string;
    label: string;
}

export default function H1(props: H1Props): JSX.Element {
    return (
        <h1>
            <a id={props.id} className="anchor" href={`#${props.id}`} aria-hidden="true">
                <span aria-hidden="true" className="octicon octicon-link" />
            </a>
            {props.label}
        </h1>
    );
}