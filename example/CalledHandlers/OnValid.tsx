import * as React from 'react';
import ColoredButton from './ColoredButton';
import { HandlerProps } from './CalledHandler';

const handler: string = 'onValid ';
const color: string = '#2ecc71';

export default function OnValid(props: HandlerProps): JSX.Element {
    return <ColoredButton label={handler + props.argument} color={color} />;
}