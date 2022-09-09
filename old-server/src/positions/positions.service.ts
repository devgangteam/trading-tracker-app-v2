import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  PositionCloseDto,
  PositionCreateDto,
  PositionUpdateDto,
} from './positions.dto';
import { Cache } from 'cache-manager';
import { AppGateway } from 'src/socket/app.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { PositionState, PositionType } from '@prisma/client';

@Injectable()
export class PositionsService {
  private readonly logger: Logger = new Logger(PositionsService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly appGateway: AppGateway,
    private readonly prismaService: PrismaService,
  ) {}

  async getOpenPositions(userId: string) {
    const cachedPositions = await this.cacheManager.get(
      `${userId}:${PositionState.OPEN}:position`,
    );

    if (typeof cachedPositions === 'string' && cachedPositions !== '[]') {
      this.logger.log(
        `[CACHE MANAGER] Found cached open positions for user ${userId}`,
      );
      const data = JSON.parse(cachedPositions);
      return data;
    }

    const openPositions = await this.prismaService.position.findMany({
      where: {
        userId,
        state: PositionState.OPEN,
      },
    });

    if(openPositions.length !== 0) {
      await this.cacheManager.set(
        `${userId}:${PositionState.OPEN}:position`,
        JSON.stringify(openPositions),
      );
  
      return openPositions;
    }

    return null;
  }

  async getClosedPositions(
    userId: string,
    size?: number,
    isGettingAll = false,
  ) {
    const take = size || 10;

    const [positions, total] = await this.prismaService.$transaction([
      this.prismaService.position.findMany({
        where: {
          userId,
          state: PositionState.CLOSED,
        },
        orderBy: [
          {
            closedAt: 'desc',
          },
        ],
        take: isGettingAll ? undefined : take,
      }),
      this.prismaService.position.count({
        where: {
          userId,
          state: PositionState.CLOSED,
        },
      }),
    ]);

    return { positions, total };
  }

  async createPosition(userId: string, positionCreateDto: PositionCreateDto) {
    try {
      const {
        entryPrice,
        stoplossPrice,
        leverage,
        margin,
        positionType,
        tokenPair,
      } = positionCreateDto;
      const newPosition = await this.prismaService.position.create({
        data: {
          entryPrice,
          stoplossPrice,
          leverage,
          margin,
          positionType,
          tokenPair,
          userId,
        },
      });
      await this.cacheManager.del(`${userId}:${PositionState.OPEN}:position`);

      await this.appGateway.notifyNewPositionToUser(userId, newPosition);
      return newPosition;
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async updatePosition(
    userId: string,
    positionId: string,
    positionDto: PositionUpdateDto,
  ) {
    try {
      await this.findPositionWithIdAndUser(positionId, userId);
      const updatedPosition = await this.prismaService.position.update({
        where: {
          id: positionId,
        },
        data: positionDto,
      });

      await this.cacheManager.del(`${userId}:${PositionState.OPEN}:position`);

      await this.appGateway.notifyUpdatedPositionToUser(
        userId,
        positionId,
        positionDto,
      );
      return updatedPosition;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async deletePosition(userId: string, positionId: string) {
    try {
      await this.findPositionWithIdAndUser(positionId, userId);
      const deletedPosition = await this.prismaService.position.delete({
        where: {
          id: positionId,
        },
      });
      await this.cacheManager.del(`${userId}:${PositionState.OPEN}:position`);

      await this.appGateway.notifyDeletedPositionToUser(userId, positionId);
      return deletedPosition;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async closePosition(
    userId: string,
    positionId: string,
    closePositionDto: PositionCloseDto,
  ) {
    try {
      const { closePrice } = closePositionDto;
      const position = await this.findPositionWithIdAndUser(positionId, userId);
      const { entryPrice, margin, leverage, positionType } = position;
      const roe = this.calculateROE(
        entryPrice,
        closePrice,
        margin,
        leverage,
        positionType,
      );
      const closedPosition = await this.prismaService.position.update({
        where: {
          id: positionId,
        },
        data: {
          state: 'CLOSED',
          closePrice: closePrice,
          closedAt: new Date(),
          ROE: roe,
        },
      });
      await this.cacheManager.del(`${userId}:${PositionState.OPEN}:position`);

      await this.appGateway.notifyClosedPositionToUser(userId, positionId);
      return closedPosition;
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error);
    }
  }

  calculateROE(
    entryPrice: number,
    currentPrice: number,
    margin: number,
    leverage: number,
    positionType: PositionType,
  ) {
    let profit = 0;
    if (positionType === PositionType.LONG) {
      profit = this.calculateLongProfit(
        entryPrice,
        currentPrice,
        margin,
        leverage,
      );
    } else {
      profit = this.calculateShortProfit(
        entryPrice,
        currentPrice,
        margin,
        leverage,
      );
    }

    return Math.round((profit / margin) * 100);
  }

  calculateLongProfit(
    entryPrice: number,
    currentPrice: number,
    margin: number,
    leverage: number,
  ) {
    return ((currentPrice - entryPrice) / entryPrice) * margin * leverage;
  }

  calculateShortProfit(
    entryPrice: number,
    currentPrice: number,
    margin: number,
    leverage: number,
  ) {
    return ((entryPrice - currentPrice) / entryPrice) * margin * leverage;
  }

  async findPositionWithIdAndUser(positionId: string, userId: string) {
    const position = await this.prismaService.position.findFirst({
      where: {
        id: positionId,
        userId,
      },
    });

    if (!position)
      throw new NotFoundException(
        `Cannot find position with id: ${positionId} of user ${userId}`,
      );
    return position;
  }
}
