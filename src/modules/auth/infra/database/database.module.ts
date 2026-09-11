import { Module } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users.repository';
import { SessionsRepository } from '../../domain/repositories/sessions.repository';
import { PrismaSessionsRepository } from './prisma/repositories/prisma-sessions.repository';

@Module({
  providers: [
    {
      provide: SessionsRepository,
      useClass: PrismaSessionsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [SessionsRepository, UsersRepository],
})
export class DatabaseModule {}
