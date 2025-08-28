import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JWT_CONSTANTS } from '../shared/constants';

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:3000' },
  path: '/ws',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationGateway');
  private jwtService = new JwtService({ secret: JWT_CONSTANTS.secret });

  // map of userId -> socketId(s)
  private userSockets = new Map<string, Set<string>>();

  async handleConnection(client: Socket) {
    const token =
      (client.handshake.auth && client.handshake.auth.token) ||
      client.handshake.query?.token;

    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload: any = this.jwtService.verify(String(token));
      const userId = payload.sub;

      // join user-specific room
      client.join(`user:${userId}`);
      const set = this.userSockets.get(userId) || new Set<string>();
      set.add(client.id);
      this.userSockets.set(userId, set);

      this.logger.log(`Client connected: ${client.id} for user ${userId}`);
    } catch (err) {
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    for (const [userId, set] of this.userSockets.entries()) {
      if (set.has(client.id)) {
        set.delete(client.id);
        if (set.size === 0) this.userSockets.delete(userId);
        else this.userSockets.set(userId, set);
        break;
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
