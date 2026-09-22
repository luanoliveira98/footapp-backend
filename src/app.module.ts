import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { EnvModule } from './infra/env/env.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthenticationModule } from './infra/authentication/authentication.module';
import { LoggingModule } from './infra/logging/logging.module';

@Module({
  imports: [
    AuthenticationModule,
    DatabaseModule,
    EnvModule,
    LoggingModule,
    AuthModule,
  ],
})
export class AppModule {}
