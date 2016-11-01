import * as React from 'react';
import Checkbox from 'material-ui/Checkbox';
import bind from 'bind-decorator';

interface SimpleCheckboxProps {
    label: string;
    checked: boolean;
    onCheck: (Checkboxd: boolean) => void;
}

export class SimpleCheckbox extends React.PureComponent<SimpleCheckboxProps, void> {
    @bind
    private onCheck(event: React.MouseEvent<{}>, checked: boolean): void {
        this.props.onCheck(checked);
    }

    public constructor(props: SimpleCheckboxProps, state: void) {
        super(props);
    }

    public render(): JSX.Element {
        const {label, checked} = this.props;
        return <Checkbox label={label} checked={checked} onCheck={this.onCheck} />;
    }
}

export default SimpleCheckbox;