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

namespace errors {
    export const invalidSymbol: 'invalidSymbol' = 'invalidSymbol';
    export const incompleteNumber: 'incompleteNumber' = 'incompleteNumber';
    export const singleMinus: 'singleMinus' = 'singleMinus';
    export const singleZero: 'singleZero' = 'singleZero';
    export const singleFloatingPoint: 'singleFloatingPoint' = 'singleFloatingPoint';
    export const none: 'none' = 'none';
}

namespace errorTexts {
    export const invalidSymbol: string = ' must be a valid number';
    export const incompleteNumber: string = 'Number is incomplete';
    export const singleMinus: string = 'Minus can be use only for negativity';
    export const singleZero: string = 'There is already a floating point';
    export const singleFloatingPoint: string = 'Floating point is expected';
}

export class LimitInput extends React.PureComponent<LimitInputProps, LimitInputState> {
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
        const { limit, onInvalidLimit } = this.props;
        let errorText: string = '';
        switch(error) {
            case errors.invalidSymbol:
                errorText = limit + errorTexts.invalidSymbol;
                break;
            case errors.incompleteNumber:
                errorText = errorTexts.incompleteNumber;
                break;
            case errors.singleMinus:
                errorText = errorTexts.singleMinus;
                break;
            case errors.singleFloatingPoint:
                errorText = errorTexts.singleFloatingPoint;
                break;
            case errors.singleZero:
                errorText = errorTexts.singleZero;
                break;
        }
        this.setState({ errorText: errorText });
        if(error !== errors.none) {
             onInvalidLimit();
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