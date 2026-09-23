import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { EnvModule } from './infra/env/env.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthenticationModule } from './infra/authentication/authentication.module';
import { LoggingModule } from './infra/logging/logging.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodValidationFilter } from './infra/http/filters/zod-validation.filter';

@Module({
  imports: [
    AuthenticationModule,
    DatabaseModule,
    EnvModule,
    LoggingModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ZodValidationFilter,
    },
  ],
})
export class AppModule {}
