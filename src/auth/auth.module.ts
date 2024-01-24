import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { DbModule } from 'src/db/db.module';
import { UsersModule } from 'src/users/users.module';
import { GoogleOauthStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { CookieService } from './cookie.service';

@Module({
  imports: [
    DbModule,
    UsersModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    RtStrategy,
    GoogleOauthStrategy,
    CookieService,
  ],
})
export class AuthModule {}
