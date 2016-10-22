import * as React from 'react';
import ColoredButton from './ColoredButton';
import { HandlerProps } from './CalledHandler';

const handler: string = 'onRequestValue ';
const color: string = '#f39c12';

export default function OnRequestValue(props: HandlerProps): JSX.Element {
    return <ColoredButton label={handler + props.argument} color={color} />;
}