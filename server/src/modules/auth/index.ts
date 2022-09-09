
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { JwtStrategy } from './strategies/jwt';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [JwtStrategy],
    exports: [PassportModule],
})
export class AuthModule { }
