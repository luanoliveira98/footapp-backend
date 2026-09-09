import { Module } from '@nestjs/common';
import { BcryptHasherService } from './bcrypt-hasher.service';
import { HashComparer } from '@/modules/auth/application/cryptography/hash-comparer';
import { HashGenerator } from '@/modules/auth/application/cryptography/hash-generator';

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasherService },
    { provide: HashGenerator, useClass: BcryptHasherService },
  ],
  exports: [HashComparer, HashGenerator],
})
export class CryptographyModule {}
