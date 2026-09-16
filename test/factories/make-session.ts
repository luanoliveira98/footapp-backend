import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  Session,
  type SessionProps,
} from '@/modules/auth/domain/entities/session';
import { PrismaSessionMapper } from '@/modules/auth/infra/database/prisma/mappers/prisma-session.mapper';
import type { ConfigEntityProps } from '@/shared/entities/entity';
import { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeSessionFactory(
  override: Partial<SessionProps> = {},
  configProps?: Omit<ConfigEntityProps, 'deletedAt'>,
) {
  const session = Session.restore(
    {
      refreshToken: new UniqueEntityId(faker.string.uuid()),
      userId: new UniqueEntityId(faker.string.uuid()),
      expiresAt: faker.date.future(),
      ...override,
    },
    configProps,
  );

  return session;
}

@Injectable()
export class SessionFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaSession(data: Partial<SessionProps> = {}): Promise<Session> {
    const session = makeSessionFactory(data);

    await this.prisma.session.create({
      data: PrismaSessionMapper.toPrisma(session),
    });

    return session;
  }
}
