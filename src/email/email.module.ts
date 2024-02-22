import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_MAIL_HOST,
        port: Number(process.env.SMTP_MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_MAIL_USER,
          pass: 'wThxLcR1f6kC6qcaxrZj',
        },
      },
      defaults: {
        from: `"noreply@stobletion.com" <${process.env.SMTP_MAIL_USER}>`,
      },
      template: {
        dir: 'src/email/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
