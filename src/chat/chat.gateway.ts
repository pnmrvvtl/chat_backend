import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Socket[] = [];

  handleConnection(client: Socket) {
    this.connectedClients.push(client);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients = this.connectedClients.filter(
      (c) => c.id !== client.id,
    );
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, message: string) {
    // Broadcast the received message to all connected clients
    this.server.emit('chatMessage', message);
  }
}
