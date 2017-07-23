import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

interface ColoredButtonProps {
    label: string;
    color: string;
}

export class ColoredButton extends React.PureComponent<ColoredButtonProps> {
    public constructor(props: ColoredButtonProps) {
        super(props);
    }

    public render(): JSX.Element {
        const { label, color } = this.props;
        return <RaisedButton label={label} disabled disabledBackgroundColor={color} />;
    }
}

export default ColoredButton;