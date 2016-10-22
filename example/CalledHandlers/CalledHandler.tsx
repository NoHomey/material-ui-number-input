import * as React from 'react';
import OnError from './OnError';
import OnChange from './OnChange';
import OnValid from './OnValid';
import OnRequestValue from './OnRequestValue';

export type HandlerName = 'onError' | 'onChange' | 'onValid' | 'onRequestValue';

export interface HandlerProps {
    argument: string;
}

export interface CalledHandlerProps extends HandlerProps {
    handler: HandlerName;
}

export namespace handlers {
    export const onError: 'onError' = 'onError';
    export const onChange: 'onChange' = 'onChange';
    export const onValid: 'onValid' = 'onValid';
    export const onRequestValue: 'onRequestValue' = 'onRequestValue';
}

export function CalledHandler(props: CalledHandlerProps): JSX.Element {
    const { handler, argument } = props;
    switch(handler) {
        case handlers.onError: return <OnError argument={argument} />;
        case handlers.onChange: return <OnChange argument={argument} />;
        case handlers.onValid: return <OnValid argument={argument} />;
        case handlers.onRequestValue: return <OnRequestValue argument={argument} />;
    }
}

export default CalledHandler;