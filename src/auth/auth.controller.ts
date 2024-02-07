import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { SignInLocalBodyDto, SignUpLocalBodyDto } from './dto';
import { AtGuard } from '../common/guards/at.guard';
import { GoogleOauthGuard, RtGuard } from 'src/common/guards';
import { GetCurrentUser, Public } from '../common/decorators';
import { CookieService } from './cookie.service';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { GetSessionInfoDto } from 'src/common/decorators/dto';
import { SessionInfo } from 'src/common/decorators/sessionInfo.decorator';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cookieService: CookieService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('local/signup')
  @ApiCreatedResponse()
  async signUpLocal(@Body() body: SignUpLocalBodyDto) {
    await this.authService.signUpLocal(body.email, body.password);
  }

  @Public()
  @Post('local/signin')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async signInLocal(
    @Body() body: SignInLocalBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.signInLocal(
      body.email,
      body.password,
    );
    this.cookieService.setTokens(res, access_token, refresh_token);
    return { access_token, refresh_token };
  }

  @Public()
  @Get('verify/:id')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async verify(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    await this.usersService.updateOne(id, { isVerified: true });
    res.redirect(`${this.configService.get('clientUrl')}/verify-success`);
  }

  @Get('google-logins/:from')
  @ApiParam({
    name: 'from',
    required: true,
    description: 'declare where to redirect user after success login',
  })
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.signInGoogle(
      req.user,
    );
    this.cookieService.setTokens(res, access_token, refresh_token);
    res.redirect(
      `${this.configService.get('clientUrl')}/google-oauth-success-redirect/${
        req.params.from
      }`,
    );
  }

  @Post('logout')
  @UseGuards(AtGuard)
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeTokens(res);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.refreshTokens(userId);
    this.cookieService.setTokens(res, access_token, refresh_token);
  }

  @Get('session')
  @UseGuards(AtGuard)
  @ApiOkResponse({
    type: GetSessionInfoDto,
  })
  getSessionInfo(@SessionInfo() session: GetSessionInfoDto): GetSessionInfoDto {
    return session;
  }
}
