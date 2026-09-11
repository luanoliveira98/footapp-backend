import { Module } from '@nestjs/common';
import { BcryptHasherService } from './bcrypt-hasher.service';
import { HashComparer } from '@/modules/auth/application/cryptography/hash-comparer';
import { HashGenerator } from '@/modules/auth/application/cryptography/hash-generator';
import { Encrypter } from '@/modules/auth/application/cryptography/encrypter';
import { JwtEncrypterService } from './jwt-encrypter.service';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypterService },
    { provide: HashComparer, useClass: BcryptHasherService },
    { provide: HashGenerator, useClass: BcryptHasherService },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
