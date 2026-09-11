import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Encrypter } from '@/modules/auth/application/cryptography/encrypter';

@Injectable()
export class JwtEncrypterService implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
