import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PrismaService } from '../prisma/PrismaService';
import { UsersService } from './service';

@Module({
  imports: [HttpModule],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule { }