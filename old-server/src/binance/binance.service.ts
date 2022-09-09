import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Binance, { ExchangeInfo } from 'binance-api-node';
import { BinanceFeatureEnum, BinanceFuturePrice } from './types';
import { PositionsService } from 'src/positions/positions.service';
import { AppGateway } from 'src/socket/app.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class BinanceService {
  private readonly logger: Logger = new Logger(BinanceService.name);
  private readonly binance = Binance();
  constructor(
    private readonly prismaService: PrismaService,
    private readonly positionsService: PositionsService,
    private readonly appGateway: AppGateway,
  ) {
    this.registerStream();
  }

  registerStream() {
    try {
      this.logger.log(`Register future token price stream`);
      this.binance.ws.futuresCustomSubStream(
        '!markPrice@arr',
        async (prices: BinanceFuturePrice[]) => {
          await this.notifyAllRelatedUsers(prices);
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async fetchCoinsFromBinance(feature: string) {
    try {
      const binanceFeature = feature && feature.toUpperCase();
      let exchangeInfo: ExchangeInfo;
      switch (binanceFeature) {
        case BinanceFeatureEnum.SPOT:
          exchangeInfo = await this.binance.exchangeInfo();
          break;
        case BinanceFeatureEnum.FUTURE:
        default:
          exchangeInfo = await this.binance.futuresExchangeInfo();
          break;
      }
      const { symbols } = exchangeInfo;
      return symbols.map(({ symbol }) => symbol);
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error);
    }
  }

  async notifyAllRelatedUsers(prices: BinanceFuturePrice[]) {
    if (!prices || prices.length === 0) {
      this.logger.log(`No price update, skip!`);
      return;
    }
    var start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const sessions = await this.prismaService.userSession.findMany({
      where: {
        status: UserStatus.ACTIVE,
        date: {
          gte: start
        }
      },
    });

    if (!sessions) {
      this.logger.log(`No active session, skip sending notification`);
      return;
    }

    const priceMap = new Map();
    prices.forEach(({ s, p }) => {
      priceMap.set(s, p);
    });

    for (const { userId } of sessions) {
      const openedPositions = await this.positionsService.getOpenPositions(
        userId,
      );

      if (openedPositions) {
        const payload =
          openedPositions &&
          openedPositions.map(
            ({ id, entryPrice, margin, leverage, positionType, tokenPair }) => {
              const currentPrice = priceMap.get(tokenPair);
              if (!currentPrice) {
                this.logger.log(
                  `Cannot get current price of pair ${tokenPair}, skip!`,
                );
                return;
              }
              const roundedCurrentPrice = Math.round(+currentPrice * 100) / 100;
              return {
                id,
                roe: this.positionsService.calculateROE(
                  entryPrice,
                  roundedCurrentPrice,
                  margin,
                  leverage,
                  positionType,
                ),
                currentPrice: roundedCurrentPrice,
              };
            },
          );

        await this.appGateway.handleNotifyToUser(userId, payload);
      }
    }
  }
}
