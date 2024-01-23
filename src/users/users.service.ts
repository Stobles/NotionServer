import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuid } from 'uuid';
import { PatchUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private db: DbService,
    private configService: ConfigService,
    private eventEmmiter: EventEmitter2,
  ) {}

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

  async create(email: string, hash?: string, salt?: string) {
    const username = email.split('@')[0];
    const user = await this.db.user.create({
      data: {
        username,
        email,
        hash,
        salt,
      },
    });
    const link = `${this.configService.get('serverUrl')}/auth/verify/${user.id}`
    this.eventEmmiter.emit('user.verify-email', {
      id: user.id,
      name: username,
      email,
      link,
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
    return this.db.user.update({
      where: { id, hashedRt: { not: null } },
      data: {
        ...payload,
      },
    });
  }
}
