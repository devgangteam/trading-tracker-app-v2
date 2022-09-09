import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { PositionsModule } from 'src/positions/positions.module';
import { AppGateway } from 'src/socket/app.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PositionsModule],
  providers: [BinanceService, AppGateway, PrismaService],
  exports: [BinanceService],
  controllers: [BinanceController],
})
export class BinanceModule {}
