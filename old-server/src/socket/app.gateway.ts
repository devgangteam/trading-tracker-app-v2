import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Position, UserStatus } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { SanitizedUser } from 'src/authz/types';
import { PositionUpdateDto } from 'src/positions/positions.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../authz/guards/jwt.guard';
import { PositionUpdatePayload } from './types';

export class SocketWithUser extends Socket {
  user: SanitizedUser;
}
@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
export class AppGateway implements OnGatewayDisconnect {
  constructor(private readonly prismaService: PrismaService) { }

  private readonly logger: Logger = new Logger(AppGateway.name);
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribePosition(client: SocketWithUser): Promise<void> {
    try {
      const userId = client.user?.id;
      if (!userId) return;
      client.join(userId);
      this.logger.log(`${client.id} joined room ${userId}`);
      const room = this.server.sockets.adapter.rooms.get(userId);
      await this.prismaService.userSession.upsert({
        where: {
          userId,
        },
        create: {
          userId,
          status: UserStatus.ACTIVE,
        },
        update: {
          status: UserStatus.ACTIVE,
          date: new Date(),
        },
      });

      this.logger.log(
        `${userId} room now has ${room.size} subscribing sockets`,
      );
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: SocketWithUser): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);
    const userId = client.user?.id;
    if (!userId) return;
    client.leave(userId);
    this.logger.log(`${client.id} left room ${userId}`);
    await this.prismaService.userSession.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        status: UserStatus.CLOSED,
      },
      update: {
        status: UserStatus.CLOSED,
        date: new Date(),
      },
    });
    const room = this.server.sockets.adapter.rooms.get(userId);
    const roomSize = room ? room.size : 0;
    this.logger.log(
      `${client.user} room now has ${roomSize} subscribing sockets`,
    );
  }

  async handleNotifyToUser(userId: string, payload: PositionUpdatePayload) {
    this.checkUserInRoom(userId);
    this.server.to(userId).emit('position-roe-updated', payload);
  }

  async notifyNewPositionToUser(userId: string, position: Position) {
    this.checkUserInRoom(userId);
    this.server.to(userId).emit('new-position', position);
  }

  async notifyUpdatedPositionToUser(
    userId: string,
    positionId: string,
    position: PositionUpdateDto,
  ) {
    this.checkUserInRoom(userId);
    this.server.to(userId).emit('edited-position', positionId, position);
  }

  async notifyDeletedPositionToUser(userId: string, positionId: string) {
    this.checkUserInRoom(userId);
    this.server.to(userId).emit('delete-position', positionId);
  }

  async notifyClosedPositionToUser(userId: string, positionId: string) {
    this.checkUserInRoom(userId);
    this.server.to(userId).emit('close-position', positionId);
  }

  checkUserInRoom(userId: string) {
    const userRoom = this.server.sockets.adapter.rooms.get(userId);
    if (!userRoom) {
      this.logger.error(`No room existed for id: ${userId}`);
    }
  }
}
