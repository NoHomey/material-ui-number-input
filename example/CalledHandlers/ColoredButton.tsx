import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

interface ColoredButtonProps {
    label: string;
    color: string;
}

export function ColoredButton(props: ColoredButtonProps): JSX.Element {
    return <RaisedButton label={props.label} disabled disabledBackgroundColor={props.color} />;
}

export default ColoredButton;