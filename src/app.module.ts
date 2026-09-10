import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { EnvModule } from './infra/env/env.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [EnvModule, DatabaseModule, AuthModule],
})
export class AppModule {}
