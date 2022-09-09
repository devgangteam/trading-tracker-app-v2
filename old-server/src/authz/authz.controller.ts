import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { clearCookies, setCookie } from 'src/utils/cookie.util';
import { AuthzService } from './authz.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './types';

@Controller('auth')
export class AuthzController {
  constructor(private readonly authzService: AuthzService, private readonly configService: ConfigService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { access_token, payload } = await this.authzService.login(req.user);
    setCookie('token', access_token, this.configService.get('maxAge'), res);
    res.send(payload);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const { access_token, payload } = await this.authzService.register(
      registerDto,
    );
    setCookie('token', access_token, this.configService.get('maxAge'), res);
    res.send(payload);
  }

  @Public()
  @Get('logout')
  async logout(@Res() res: Response) {
    clearCookies(res);
    res.send(null);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
