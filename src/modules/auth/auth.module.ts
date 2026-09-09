import { Module } from '@nestjs/common';
import { CryptographyModule } from './infra/cryptography/cryptography.module';
import { DatabaseModule } from './infra/database/database.module';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [CryptographyModule, DatabaseModule, HttpModule],
})
export class AuthModule {}
