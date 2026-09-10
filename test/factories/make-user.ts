import type { PrismaService } from '@/infra/database/prisma/prisma.service';
import { User, type UserProps } from '@/modules/auth/domain/entities/user';
import { Email } from '@/modules/auth/domain/value-objects/email';
import { PrismaUserMapper } from '@/modules/auth/infra/database/prisma/mappers/prisma-user.mapper';
import type { ConfigEntityProps } from '@/shared/entities/entity';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeUserFactory(
  override: Partial<UserProps> = {},
  configProps?: ConfigEntityProps,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: Email.restore(faker.internet.email()),
      passwordHash: faker.internet.password(),
      ...override,
    },
    configProps,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUserFactory(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
