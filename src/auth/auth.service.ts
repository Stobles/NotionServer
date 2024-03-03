import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt/dist';
import { Tokens } from './types';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUpLocal(email: string, password: string): Promise<Tokens> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      throw new ConflictException('Пользователь уже существует.');
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const newUser = await this.usersService.create({ email, hash, salt });

    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.username,
      newUser.avatar,
    );
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async signInLocal(email: string, password: string): Promise<Tokens> {
    const user = await this.usersService.findByEmail(email);

    if (!user || user?.isProvider)
      throw new NotFoundException('Пользователь не найден');

    if (!user.isVerified) throw new ForbiddenException('Подвердите почту.');

    const hash = this.passwordService.getHash(password, user.salt);

    if (user.hash != hash) throw new ForbiddenException('Неверный пароль.');

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.username,
      user.avatar,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async googleUserValidate(googleUser: GoogleUser): Promise<any> {
    const user = await this.usersService.findByEmail(googleUser.email);
    if (!user) {
      const newUser = await this.signUpGoogle(googleUser);
      return newUser;
    }
    if (user) {
      return user;
    }
    return null;
  }

  async signUpGoogle(user: GoogleUser) {
    const newUser = await this.usersService.createGoogleUser(
      user.email,
      user.username,
      user.avatar,
    );

    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.username,
      newUser.avatar,
    );
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async signInGoogle(user: GoogleUser) {
    if (!user) throw new BadRequestException();

    const userExist = await this.usersService.findByEmail(user.email);

    if (!userExist) {
      return this.signUpGoogle(user);
    }

    const tokens = await this.getTokens(
      userExist.id,
      userExist.email,
      userExist.username,
      userExist.avatar,
    );
    await this.updateRtHash(userExist.id, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async logout(userId: string) {
    await this.usersService.updateWhereRtNotNull(userId, {
      hashedRt: null,
    });
  }

  async refreshTokens(userId: string) {
    const user = await this.usersService.findById(userId);

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.username,
      user.avatar,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.usersService.updateOne(userId, {
      hashedRt: hash,
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(
    userId: string,
    email: string,
    username: string,
    avatar: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          username,
          avatar,
        },
        {
          secret: this.configService.get('jwt.accessSecret'),
          expiresIn: parseInt(this.configService.get('jwt.accessExpiration')),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          username,
          avatar,
        },
        {
          secret: this.configService.get('jwt.refreshSecret'),
          expiresIn: parseInt(this.configService.get('jwt.refreshExpiration')),
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
