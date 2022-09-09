import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { parse } from 'cookie';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const customExtractor = (data: any) => {
      if (data.handshake) {
        const cookies = parse(data.handshake.headers.cookie);
        return cookies['token'];
      }
      return data.cookies && data.cookies['token'];
    };

    super({
      jwtFromRequest: customExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt').secret,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, username: payload.username, email: payload.email, role: payload.role };
  }
}
