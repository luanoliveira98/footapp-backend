import { Module } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users.repository';

@Module({
  providers: [
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersRepository],
})
export class DatabaseModule {}
