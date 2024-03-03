import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PatchUserDto } from './dto/patch-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private db: DbService,
    private configService: ConfigService,
    private eventEmmiter: EventEmitter2,
  ) {}

  async create(payload: CreateUserDto) {
    let username = payload.email.split('@')[0];
    username = username.charAt(0).toUpperCase() + username.slice(1);
    console.log(username);
    const user = await this.db.user.create({
      data: {
        username,
        ...payload,
      },
    });
    const link = `${this.configService.get('serverUrl')}/auth/verify/${
      user.id
    }`;
    this.eventEmmiter.emit('user.verify-email', {
      id: user.id,
      name: username,
      email: payload.email,
      link,
    });

    this.eventEmmiter.emit('documents.create', {
      userId: user.id,
      title: 'Untitled',
    });

    return user;
  }

  async createGoogleUser(email: string, username: string, avatar: string) {
    const user = await this.db.user.create({
      data: {
        username,
        email,
        hash: '',
        salt: '',
        isProvider: true,
        avatar,
      },
    });

    return user;
  }

  findById(id: string) {
    return this.db.user.findFirst({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.db.user.findFirst({
      where: { email },
    });
  }

  async findUserWithRefresh(userId: string, refreshToken: string) {
    const user = await this.findById(userId);
    const isRefreshMatches = bcrypt.compare(refreshToken, user.hashedRt);
    if (isRefreshMatches) return user;
  }

  async updateOne(id: string, payload: PatchUserDto) {
    if (!payload) throw new BadRequestException();
    return this.db.user.update({
      where: { id },
      data: {
        ...payload,
      },
    });
  }

  async updateWhereRtNotNull(id: string, payload: PatchUserDto) {
    if (!payload) throw new BadRequestException();
    return this.db.user.update({
      where: { id, hashedRt: { not: null } },
      data: {
        ...payload,
      },
    });
  }
}
