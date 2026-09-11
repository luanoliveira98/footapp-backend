import { Module } from '@nestjs/common';
import { RegisterAccountUseCase } from '../../domain/use-cases/register-account.use-case';
import { RegisterAccountController } from './controllers/register-account.controller';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateUseCase } from '../../domain/use-cases/authenticate.use-case';
import { AuthenticateController } from './controllers/authenticate.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [AuthenticateUseCase, RegisterAccountUseCase],
  controllers: [AuthenticateController, RegisterAccountController],
})
export class HttpModule {}
