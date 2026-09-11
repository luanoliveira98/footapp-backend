import { PrismaService } from '@/infra/database/prisma/prisma.service';
import type { Session } from '@/modules/auth/domain/entities/session';
import type { SessionsRepository } from '@/modules/auth/domain/repositories/sessions.repository';
import { Injectable } from '@nestjs/common';
import { PrismaSessionMapper } from '../mappers/prisma-session.mapper';

@Injectable()
export class PrismaSessionsRepository implements SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(session: Session): Promise<void> {
    await this.prisma.session.create({
      data: PrismaSessionMapper.toPrisma(session),
    });
  }
}
