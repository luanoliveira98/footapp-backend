import { User } from '@/modules/auth/domain/entities/user';
import { Email } from '@/modules/auth/domain/value-objects/email';
import { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';
import type { User as PrismaUser, Prisma } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.restore(
      {
        name: raw.name,
        email: Email.restore(raw.email),
        passwordHash: raw.passwordHash,
      },
      {
        id: new UniqueEntityId(raw.id),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email.toString(),
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
