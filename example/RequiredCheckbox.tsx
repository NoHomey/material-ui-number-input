import * as React from 'react';
import Checkbox from 'material-ui/Checkbox';
import bind from 'bind-decorator';

interface RequiredCheckboxProps {
    required: boolean;
    onRequiredChecked: (Checkboxd: boolean) => void;
}

export class RequiredCheckbox extends React.Component<RequiredCheckboxProps, void> {
    @bind
    private requiredCheckbox(event: React.MouseEvent<{}>, Checkboxd: boolean): void {
        this.props.onRequiredChecked(Checkboxd);
    }

    public constructor(props: RequiredCheckboxProps, state: void) {
        super(props);
    }

    public render(): JSX.Element {
        return <Checkbox label="required" checked={this.props.required} onCheck={this.requiredCheckbox} />;
    }
}

export default RequiredCheckbox;