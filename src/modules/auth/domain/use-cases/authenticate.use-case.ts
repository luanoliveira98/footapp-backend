import { left, right, type Either } from '@/shared/utils/either';
import { WrongCredentialsError } from '../errors/wrong-credentials.error';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { HashComparer } from '@/modules/auth/application/cryptography/hash-comparer';
import { Encrypter } from '@/modules/auth/application/cryptography/encrypter';
import { SessionsRepository } from '../repositories/sessions.repository';
import { Session } from '../entities/session';
import { UniqueEntityId } from '@/shared/value-objects/unique-entity-id';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateResponse {
  accessToken: string;
  refreshToken: string;
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  AuthenticateResponse
>;

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return left(new WrongCredentialsError());

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) return left(new WrongCredentialsError());

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    const session = Session.create({
      userId: user.id,
      refreshToken: new UniqueEntityId(),
    });

    await this.sessionsRepository.create(session);

    return right({
      accessToken,
      refreshToken: session.refreshToken.toString(),
    });
  }
}
