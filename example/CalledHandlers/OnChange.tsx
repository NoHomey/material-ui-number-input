import * as React from 'react';
import ColoredButton from './ColoredButton';
import { HandlerProps } from './CalledHandler';

const handler: string = 'onChange ';
const color: string = '#9b59b6';

export default class OnChange extends React.PureComponent<HandlerProps, void> {
    public constructor(props: HandlerProps) {
        super(props);
    }

    public render(): JSX.Element {
        return <ColoredButton label={handler + this.props.argument} color={color} />;
    }
}