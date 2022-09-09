import { Controller, Get, ParseIntPipe, Query, Req } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RequestWithUser } from 'src/authz/types';
import { Roles } from 'src/decorators/role.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  getUserInfo(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get()
  @Roles(Role.LEADER)
  async getUsers(@Req() { user: { id, role } }: RequestWithUser, @Query('page') page?: number, @Query('size') size?: number) {
    return await this.usersService.getUsers(id, role === Role.ADMIN, page, size);
  }
}
