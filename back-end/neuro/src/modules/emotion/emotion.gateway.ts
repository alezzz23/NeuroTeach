import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/emotion',
})
export class EmotionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // Autenticación JWT por query param
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    if (!token) {
      client.emit('error', 'No token provided');
      client.disconnect();
      return;
    }
    try {
      // Cambia la clave secreta por la de tu JWT
      jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (e) {
      client.emit('error', 'Invalid token');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Puedes agregar lógica de desconexión si lo deseas
  }

  @SubscribeMessage('frame')
  handleFrame(@MessageBody() data: { image: string }, @ConnectedSocket() client: Socket) {
    // Aquí puedes poner lógica real de análisis de emociones
    const emotions = ['feliz', 'frustrado', 'aburrido', 'confundido'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    // Devuelve la emoción al cliente
    client.emit('emotion', { emotion: randomEmotion });
  }
} 