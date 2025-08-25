//comments.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private comments: { userId: string; text: string; date: string }[] = [];
  private userMap: Map<string, string> = new Map(); // socket.id -> username
  private userCount = 0;

  handleConnection(client: Socket) {
    this.userCount++;
    const username =
      (client.handshake.query.username as string) || `User${this.userCount}`;
    this.userMap.set(client.id, username);
    console.log(`Client connected: ${username} (${client.id})`);
  }

  handleDisconnect(client: Socket) {
    const username = this.userMap.get(client.id);
    console.log(`Client disconnected: ${username || client.id}`);
    this.userMap.delete(client.id);
  }

  @SubscribeMessage('add_comment')
  handleNewComment(
    @MessageBody() comment: string,
    @ConnectedSocket() client: Socket,
  ) {
    const username = this.userMap.get(client.id) || client.id;



     const dat = new Date().toLocaleString(); // <-- use ISO for consistency
    const entry = { userId: username, text: comment, date: dat };

    this.comments.unshift(entry);

    // full log of the object being sent
    console.log('New comment entry:', entry);
console.log("date is:",dat);

    // broadcast to all clients
    this.server.emit('new_comment', entry);
  }

  @SubscribeMessage('get_comments')
  handleGetComments() {
    return this.comments;
  }
}
