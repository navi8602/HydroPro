// server/services/websocket/websocket.service.ts
import WebSocket from 'ws';
import { Server } from 'http';

export class WebSocketService {
    private static wss: WebSocket.Server;
    private static clients: Map<string, WebSocket> = new Map();

    static initialize(server: Server) {
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (ws: WebSocket, req) => {
            const userId = this.getUserIdFromRequest(req);
            if (userId) {
                this.clients.set(userId, ws);

                ws.on('close', () => {
                    this.clients.delete(userId);
                });
            }
        });
    }

    static sendNotification(notification: any) {
        const userId = notification.userId;
        const client = this.clients.get(userId);

        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'notification',
                data: notification
            }));
        }
    }

    private static getUserIdFromRequest(req: any): string | null {
        // Implementation to extract user ID from request
        // (e.g., from query parameters or JWT token)
        return req.userId || null;
    }
}
