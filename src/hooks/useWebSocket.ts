import { useEffect } from 'react';
import { wsClient } from '../api/wsClient';

export function useWebSocket(event: string, callback: Function) {
    useEffect(() => {
        wsClient.subscribe(event, callback);
        return () => {
            wsClient.unsubscribe(event, callback);
        };
    }, [event, callback]);

    return {
        sendMessage: (event: string, data: any) => wsClient.sendMessage(event, data)
    };
}
