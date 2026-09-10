import type { HashGenerator } from '@/modules/auth/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator {
  async hash(value: string): Promise<string> {
    return Promise.resolve(`hashed-${value}`);
  }
}
