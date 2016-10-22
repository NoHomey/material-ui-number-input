import * as React from 'react';
import ColoredButton from './ColoredButton';
import { HandlerProps } from './CalledHandler';

const handler: string = 'onRequestValue ';
const color: string = '#f39c12';

export default class OnRequestValue extends React.PureComponent<HandlerProps, void> {
    public constructor(props: HandlerProps) {
        super(props);
    }

    public render(): JSX.Element {
        return <ColoredButton label={handler + this.props.argument} color={color} />;
    }
}