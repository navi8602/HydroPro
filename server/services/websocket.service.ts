// server/services/websocket.service.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/auth';

export class WebSocketService {
    private io: Server;

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL,
                methods: ['GET', 'POST']
            }
        });

        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                const user = await verifyToken(token);
                socket.data.user = user;
                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.io.on('connection', (socket) => {
            const userId = socket.data.user.id;

            // Join user-specific room
            socket.join(`user:${userId}`);

            socket.on('subscribe:system', (systemId: string) => {
                socket.join(`system:${systemId}`);
            });

            socket.on('unsubscribe:system', (systemId: string) => {
                socket.leave(`system:${systemId}`);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }

    public emitSystemMetrics(systemId: string, metrics: SystemMetrics) {
        this.io.to(`system:${systemId}`).emit('metrics:update', metrics);
    }

    public emitPlantUpdate(systemId: string, plantId: string, data: any) {
        this.io.to(`system:${systemId}`).emit('plant:update', { plantId, ...data });
    }

    public emitNotification(userId: string, notification: Notification) {
        this.io.to(`user:${userId}`).emit('notification:new', notification);
    }
}
