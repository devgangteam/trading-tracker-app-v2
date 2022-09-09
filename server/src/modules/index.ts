import { PrismaService } from '@/modules/prisma/PrismaService';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthModule } from './auth';
import { JwtAuthGuard } from './auth/guards/jwt';
import { HealthModule } from './health';
import { UsersModule } from './users';

@Module({
    imports: [HealthModule, AuthModule, UsersModule],
    providers: [
        PrismaService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ]
})
export class AppModule { }