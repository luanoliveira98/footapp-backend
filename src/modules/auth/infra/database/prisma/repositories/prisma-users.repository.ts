/* eslint-disable @typescript-eslint/unbound-method */
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import type { User } from '@/modules/auth/domain/entities/user';
import { UsersRepository } from '@/modules/auth/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id.toString() },
      data: PrismaUserMapper.toPrisma(user),
    });
  }

  async list(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map(PrismaUserMapper.toDomain);
  }
}
