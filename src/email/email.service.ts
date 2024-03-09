import { Injectable } from '@nestjs/common';
import { EventPayloads } from './interface/eventEmitter.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  @OnEvent('user.verify-email')
  async verifyEmail(data: EventPayloads['user.verify-email']) {
    const { id, name, email, link } = data;

    const subject = `Company: OTP To Verify Email`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template: './verify-email',
        context: {
          id,
          name,
          link,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
