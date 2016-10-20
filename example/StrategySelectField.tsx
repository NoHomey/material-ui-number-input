import * as React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import bind from 'bind-decorator';
import { TouchTapEvent } from 'material-ui';

export const ignore: 'ignore' = 'ignore';
export const warn: 'warn' = 'warn';
export const allow: 'allow' = 'allow'

export type Strategy = 'ignore' | 'warn' | 'allow';

interface StrategySelectFieldProps {
    strategy: Strategy
    onStrategyChange: (strategy: Strategy) => void
}

export class StrategySelectField extends React.Component<StrategySelectFieldProps, void> {
    @bind
    private changeStrategy(event: TouchTapEvent, index: number, value: string): void {
        this.props.onStrategyChange(value as Strategy);
    }

    public constructor(props: StrategySelectFieldProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <SelectField value={this.props.strategy} onChange={this.changeStrategy} floatingLabelText="strategy">
                <MenuItem value={allow} primaryText={allow} />
                <MenuItem value={warn} primaryText={warn} />
                <MenuItem value={ignore} primaryText={ignore} />
            </SelectField>
        );
    }
}

export default StrategySelectField;