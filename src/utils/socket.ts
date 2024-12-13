// src/utils/socket.ts
import { io } from 'socket.io-client';
import { WS_URL } from '../config/api';

export const socket = io(WS_URL, {
    auth: {
        token: localStorage.getItem('token')
    }
});
