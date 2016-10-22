import * as React from 'react';
import ColoredButton from './ColoredButton';
import { HandlerProps } from './CalledHandler';

const handler: string = 'onValid ';
const color: string = '#2ecc71';

export default class OnValid extends React.PureComponent<HandlerProps, void> {
    public constructor(props: HandlerProps) {
        super(props);
    }

    public render(): JSX.Element {
        return <ColoredButton label={handler + this.props.argument} color={color} />;
    }
}