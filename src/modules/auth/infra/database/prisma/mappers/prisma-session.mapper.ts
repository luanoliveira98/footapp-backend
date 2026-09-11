import { Session } from '@/modules/auth/domain/entities/session';
import { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';
import type { Prisma, Session as PrismaSession } from '@prisma/client';

export class PrismaSessionMapper {
  static toDomain(raw: PrismaSession): Session {
    return Session.restore(
      {
        userId: new UniqueEntityId(raw.userId),
        refreshToken: new UniqueEntityId(raw.refreshToken),
        expiresAt: raw.expiresAt,
      },
      {
        id: new UniqueEntityId(raw.id),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
    );
  }

  static toPrisma(session: Session): Prisma.SessionUncheckedCreateInput {
    return {
      id: session.id.toString(),
      refreshToken: session.refreshToken.toString(),
      expiresAt: session.expiresAt,
      userId: session.userId.toString(),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
