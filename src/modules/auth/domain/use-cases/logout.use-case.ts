import { right, type Either } from '@/shared/utils/either';
import { Injectable } from '@nestjs/common';
import { SessionsRepository } from '../repositories/sessions.repository';

interface LogoutUseCaseRequest {
  refreshToken: string;
  userId: string;
}

type LogoutUseCaseResponse = Either<null, null>;

@Injectable()
export class LogoutUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async execute({
    refreshToken,
    userId,
  }: LogoutUseCaseRequest): Promise<LogoutUseCaseResponse> {
    await this.sessionsRepository.delete({ refreshToken, userId });

    return right(null);
  }
}
