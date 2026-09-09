import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { EnvModule } from './infra/env/env.module';

@Module({
  imports: [EnvModule, DatabaseModule],
})
export class AppModule {}
