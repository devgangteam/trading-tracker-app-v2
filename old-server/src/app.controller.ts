import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { RequestWithUser } from './authz/types';
import { UsersService } from './users/users.service';
import { UserProfileSettingsDto } from './users/users.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);
  constructor(private readonly usersService: UsersService) { }

  @Get('/health')
  @Public()
  checkHealth(@Res() res: Response) {
    res.status(200).end();
  }

  @Get('/authCheck')
  checkAuth(@Req() { user }: RequestWithUser, @Res() res: Response) {
    this.logger.log(`Checking auth with user ${user}`);
    res.status(200).end();
  }

  @Get('/profile-settings')
  async getUserProfile(@Req() { user }: RequestWithUser) {
    try {
      return await this.usersService.getOrUpdateProfileSettings(user.id);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/profile-settings')
  async updateUserProfile(
    @Req() { user }: RequestWithUser,
    @Body() { totalPropertyAmount, maximumRisk }: UserProfileSettingsDto,
  ) {
    try {
      return await this.usersService.getOrUpdateProfileSettings(
        user.id,
        totalPropertyAmount > 0 ? totalPropertyAmount : undefined,
        maximumRisk > 0 ? maximumRisk : undefined,
      );
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }
}
