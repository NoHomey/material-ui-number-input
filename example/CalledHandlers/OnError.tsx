import * as React from 'react';
import ColoredButton from './ColoredButton';
import { HandlerProps } from './CalledHandler';

const handler: string = 'onError ';
const color: string = '#ff5733';

export default function OnError(props: HandlerProps): JSX.Element {
    return <ColoredButton label={handler + props.argument} color={color} />;
}