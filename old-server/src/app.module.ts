import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AuthzModule } from './authz/authz.module';
import { JwtAuthGuard } from './authz/guards/jwt.guard';
import { RolesGuard } from './authz/guards/roles.guard';
import { BinanceModule } from './binance/binance.module';
import { BlogsModule } from './blogs/blogs.module';
import configuration from './config/configuration';
import { PositionsModule } from './positions/positions.module';
import { PrismaService } from './prisma/prisma.service';
import { AppGateway } from './socket/app.gateway';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthzModule,
    PositionsModule,
    BinanceModule,
    UsersModule,
    BlogsModule,
    MailModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppGateway,
  ],
  controllers: [AppController],
})
export class AppModule {}
