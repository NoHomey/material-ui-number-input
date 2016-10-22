import * as React from 'react';
import Checkbox from 'material-ui/Checkbox';
import bind from 'bind-decorator';

interface RequiredCheckboxProps {
    required: boolean;
    onRequiredCheck: (Checkboxd: boolean) => void;
}

export class RequiredCheckbox extends React.PureComponent<RequiredCheckboxProps, void> {
    @bind
    private requiredCheckbox(event: React.MouseEvent<{}>, Checkboxd: boolean): void {
        this.props.onRequiredCheck(Checkboxd);
    }

    public constructor(props: RequiredCheckboxProps, state: void) {
        super(props);
    }

    public render(): JSX.Element {
        return <Checkbox label="required" checked={this.props.required} onCheck={this.requiredCheckbox} />;
    }
}

export default RequiredCheckbox;