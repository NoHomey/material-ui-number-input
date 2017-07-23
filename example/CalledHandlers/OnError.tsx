import * as React from 'react';
import ColoredButton from './ColoredButton';
import { HandlerProps } from './CalledHandler';

const handler: string = 'onError ';
const color: string = '#ff5733';

export default class OnError extends React.PureComponent<HandlerProps> {
    public constructor(props: HandlerProps) {
        super(props);
    }

    public render(): JSX.Element {
        return <ColoredButton label={handler + this.props.argument} color={color} />;
    }
}