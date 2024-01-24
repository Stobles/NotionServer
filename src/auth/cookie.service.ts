import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}
  static accessTokenKey = 'Authentication';
  static refreshTokenKey = 'Refresh';

  setTokens(res: Response, accessToken: string, refreshToken: string) {
    const accessCookie = `${
      CookieService.accessTokenKey
    }=${accessToken}; HttpOnly; Domain=stoble.ru; Path=/; Max-Age=${this.configService.get(
      'jwt.accessExpiration',
    )}`;
    const refreshCookie = `${
      CookieService.refreshTokenKey
    }=${refreshToken}; HttpOnly; Domain=stoble.ru; Path=/; Max-Age=${this.configService.get(
      'jwt.refreshExpiration',
    )}`;
    res.setHeader('Set-Cookie', accessCookie);
    res.setHeader('Set-Cookie', refreshCookie);
  }

  removeTokens(res: Response) {
    res.clearCookie(CookieService.accessTokenKey);
    res.clearCookie(CookieService.refreshTokenKey);
  }
}
