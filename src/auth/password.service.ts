import { Injectable } from '@nestjs/common';
import { pbkdf2Sync, randomBytes } from 'crypto';

@Injectable()
export class PasswordService {
  getSalt(): string {
    return randomBytes(16).toString('hex');
  }

  getHash(password: string, salt: string): string {
    return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }
}
