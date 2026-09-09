import { Module } from '@nestjs/common';
import { RegisterAccountUseCase } from '../../domain/use-cases/register-account.use-case';
import { RegisterAccountController } from './controllers/register-account.controller';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [RegisterAccountUseCase],
  controllers: [RegisterAccountController],
})
export class HttpModule {}
