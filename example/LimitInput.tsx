import * as React from 'react';
import bind from 'bind-decorator';
import { NumberInput, NumberInputError } from 'material-ui-number-input';

interface LimitInputProps {
    limit: string;
    onValidLimit: (valid: number) => void;
    onInvalidLimit: () => void;
}

interface LimitInputState {
    value?: string;
    errorText?: string;
}

export class LimitInput extends React.Component<LimitInputProps, LimitInputState> {
    private lastValid: number;

    @bind
    private onValid(valid: number): void {
        this.lastValid = valid;
        this.props.onValidLimit(valid);
    }

    @bind
    private onChange(event: React.FormEvent<{}>, value: string): void {
        this.setState({ value: value });
        if(this.lastValid === Number(value)) {
            this.props.onValidLimit(this.lastValid);
        }
    }

    @bind
    private onError(error: NumberInputError): void {
        let errorText: string = '';
        switch(error) {
            case 'invalidSymbol':
                errorText = `${this.props.limit} must be a valid number`;
                break;
            case 'incompleteNumber':
                errorText = 'Number is incomplete';
                break;
            case 'singleMinus':
                errorText = 'Minus can be use only for negativity';
                break;
            case 'singleFloatingPoint':
                errorText = 'There is already a floating point';
                break;
            case 'singleZero':
                errorText = 'Floating point is expected';
                break;
        }
        this.setState({ errorText: errorText });
        if(error !== 'none') {
            this.props.onInvalidLimit();
        }
    }

    public constructor(props: LimitInputProps) {
        super(props);
        this.state = { value: '' };
        this.lastValid = 0;
    }

    public render(): JSX.Element {
        const { value, errorText } = this.state;
        const { limit } = this.props;
        return (
            <NumberInput
                id={limit}
                floatingLabelText={limit}
                value={value}
                errorText={errorText}
                onError={this.onError}
                onValid={this.onValid}
                onChange={this.onChange} />
        );
    }
}

export default LimitInput;