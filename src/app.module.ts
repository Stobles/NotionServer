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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        SERVER_URL_BASE: Joi.string().required(),
        JWT_ACCESS_EXPIRATION: Joi.number().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRATION: Joi.number().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    DbModule,
    AuthModule,
    EmailModule,
    DocumentsModule,
  ],
})
export class AppModule {}
