import { io, Socket } from "socket.io-client";
import { SystemMetrics } from "../types/system";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000";

class WebSocketClient {
    private static instance: WebSocketClient;
    private socket: Socket | null = null;
    private listeners: Map<string, Set<Function>> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    private constructor() {
        this.connect();
    }

    static getInstance(): WebSocketClient {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient();
        }
        return WebSocketClient.instance;
    }

    private connect() {
        this.socket = io(WS_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                this.socket?.disconnect();
            }
        });

        this.socket.on('metrics_update', (data: SystemMetrics) => {
            this.emit('metrics_update', data);
        });

        this.socket.on('system_alert', (data: any) => {
            this.emit('system_alert', data);
        });
    }

    subscribe(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);
    }

    unsubscribe(event: string, callback: Function) {
        this.listeners.get(event)?.delete(callback);
    }

    private emit(event: string, data: any) {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }

    sendMessage(event: string, data: any) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    disconnect() {
        this.socket?.disconnect();
        this.listeners.clear();
    }

    reconnect() {
        if (this.socket?.disconnected) {
            this.reconnectAttempts = 0;
            this.socket.connect();
        }
    }
}

export const wsClient = WebSocketClient.getInstance();
