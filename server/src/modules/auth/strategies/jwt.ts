import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable } from '@nestjs/common/decorators';
import { ExtractJwt, Strategy, VerifiedCallback, VerifyCallback, VerifyCallbackWithRequest } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { passportJwtSecret } from 'jwks-rsa';

import { ManagementClient } from 'auth0'

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly auth0: ManagementClient;
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],

    });

    //TODO: move this one to a service, then use that service in this strategy
    this.auth0 = new ManagementClient({
      domain:`trading-tracker-test.jp.auth0.com`,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      scope: 'read:users'
    });
  }

  async validate(payload: any): Promise<unknown> {
    try {
      const test = await this.auth0.getUser({
        id: payload.sub
      });

      const user: any = {
        id: test.user_id,
        name: test.name,
        nickname: test.nickname,
        picture: test.picture,
        role: test.app_metadata?.role,
        email: test.email
      }
      
      return user
      
    } catch (error) {
      console.log('test', error)
    }
    return payload;
  }
}