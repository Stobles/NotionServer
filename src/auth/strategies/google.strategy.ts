import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('google.clientId'),
      clientSecret: configService.get('google.clientSecret'),
      callbackURL: configService.get('google.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  authenticate(req: any, options: any) {
    if (!options?.state) {
      options = { ...options, state: req.params.from };
    }

    return super.authenticate(req, options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const googleUser = {
      provider: 'google',
      providerId: profile?.id,
      username: profile?.displayName,
      email: profile?.emails[0].value,
      avatar: profile?.photos[0].value,
      accessToken,
      refreshToken,
    };

    const user = await this.authService.googleUserValidate(googleUser);
    done(null, user);
  }
}
