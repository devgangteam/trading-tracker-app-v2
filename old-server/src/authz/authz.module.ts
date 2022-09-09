import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthzController } from './authz.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthzService } from './authz.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get('jwt');
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthzService, LocalStrategy, PrismaService, JwtStrategy],
  controllers: [AuthzController],
  exports: [AuthzService],
})
export class AuthzModule {}
