import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';
import { config } from './common/config';
import { EmailModule } from './email/email.module';
import { DocumentsModule } from './documents/documents.module';
import { FavoritesService } from './favorites/favorites.service';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        SERVER_URL_BASE: Joi.string().required(),
        CLIENT_URL_BASE: Joi.string().required(),
        HOST_COOKIE: Joi.string().required(),
        JWT_ACCESS_EXPIRATION: Joi.number().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION: Joi.number().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        SMTP_MAIL_HOST: Joi.string().required(),
        SMTP_MAIL_PORT: Joi.number().required(),
        SMTP_MAIL_USER: Joi.string().required(),
        SMTP_MAIL_PASSWORD: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    DbModule,
    AuthModule,
    EmailModule,
    DocumentsModule,
    FavoritesModule,
  ],
  providers: [FavoritesService],
})
export class AppModule {}
