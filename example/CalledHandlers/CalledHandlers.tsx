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

export function CalledHandlers(props: CalledHandlersProps): JSX.Element {
    return <div>{props.calledHandlers.map(renderCalledHandler)}</div>;
}

export default CalledHandlers;