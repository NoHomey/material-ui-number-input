import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

interface ColoredButtonProps {
    label: string;
    color: string;
    colored: boolean;
}

const noColor: string = "#ffffff";

export function ColoredButton(props: ColoredButtonProps): JSX.Element {
    const { label, colored, color } = props;
    return (
        <RaisedButton
            label={label}
            disabled
            disabledBackgroundColor={colored ? color : noColor} />
    );
}

export default ColoredButton;