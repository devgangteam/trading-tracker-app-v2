import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppGateway } from 'src/socket/app.gateway';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, AppGateway, PrismaService],
  exports: [PositionsService],
})
export class PositionsModule {}
