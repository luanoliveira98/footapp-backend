import type { HashComparer } from '@/modules/auth/application/cryptography/hash-comparer';
import type { HashGenerator } from '@/modules/auth/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(value: string): Promise<string> {
    return Promise.resolve(`hashed-${value}`);
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return Promise.resolve(hash === `hashed-${plaintext}`);
  }
}
