import type { HashComparer } from '@/modules/auth/application/cryptography/hash-comparer';
import type { HashGenerator } from '@/modules/auth/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptHasherService implements HashComparer, HashGenerator {
  private readonly HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
