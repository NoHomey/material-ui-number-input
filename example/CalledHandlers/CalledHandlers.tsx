import * as React from 'react';
import { CalledHandlerProps, CalledHandler, handlers } from './CalledHandler';

export type CalledHandlersStack = Array<CalledHandlerProps>;

export { handlers }

interface CalledHandlersProps {
    calledHandlers: CalledHandlersStack;
}

function renderCalledHandler(props: CalledHandlerProps, index: number): JSX.Element {
    const { handler, argument } = props;
    return (
        <div key={handler + argument + index}>
            <CalledHandler handler={handler} argument={argument} />
        </div>
    );
}

const emptyMessage: string = 'No Handler has been called.';

export class CalledHandlers extends React.Component<CalledHandlersProps, void> {
    private length: number;

    public constructor(props: CalledHandlersProps) {
        super(props);
        this.length = 0;
    }

    public shouldComponentUpdate(props: CalledHandlersProps): boolean {
        const { length } = props.calledHandlers;  
        const lengthDiffers: boolean = this.length !== length;
        if(lengthDiffers) {
            this.length = length
        }
        return lengthDiffers;
    }

    public render(): JSX.Element {
        const { calledHandlers } = this.props;
        return <div>{calledHandlers.length ? calledHandlers.map(renderCalledHandler) : emptyMessage}</div>;
    }
}

export default CalledHandlers;