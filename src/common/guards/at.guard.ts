import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { CookieService } from 'src/auth/cookie.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest() as Request;
    const accessToken = req.cookies[CookieService.accessTokenKey];

    if (!accessToken) {
      throw new HttpException('No access token', HttpStatus.UNAUTHORIZED);
    }

    try {
      const sessionInfo = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('jwt.accessSecret'),
      });

      req['session'] = sessionInfo;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    return true;
  }
}
