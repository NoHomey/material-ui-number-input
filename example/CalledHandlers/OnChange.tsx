import * as React from 'react';
import ColoredButton from './ColoredButton';
import { HandlerProps } from './CalledHandler';

const handler: string = 'onChange ';
const color: string = '#9b59b6';

export default function OnChange(props: HandlerProps): JSX.Element {
    return <ColoredButton label={handler + props.argument} color={color} />;
}