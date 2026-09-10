import { left, right, type Either } from '@/shared/utils/either';
import { HashGenerator } from '@/modules/auth/application/cryptography/hash-generator';
import { UsersRepository } from '../repositories/users.repository';
import { EmailAlreadyExistsError } from '../errors/email-already-exists.error';
import { InvalidEmailError } from '../errors/invalid-email.error';
import { Email } from '../value-objects/email';
import { User } from '../entities/user';
import { Injectable } from '@nestjs/common';

interface RegisterAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterAccountResponse {
  id: string;
  name: string;
  email: string;
}

type RegisterAccountUseCaseResponse = Either<
  EmailAlreadyExistsError | InvalidEmailError,
  {
    user: RegisterAccountResponse;
  }
>;
@Injectable()
export class RegisterAccountUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterAccountUseCaseRequest): Promise<RegisterAccountUseCaseResponse> {
    const userEmail = Email.create(email);

    if (userEmail.isLeft()) return left(new InvalidEmailError());

    const userAlreadyExists = await this.usersRepository.findByEmail(
      userEmail.value.toString(),
    );

    if (userAlreadyExists) return left(new EmailAlreadyExistsError());

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email: userEmail.value,
      passwordHash: hashedPassword,
    });

    await this.usersRepository.create(user);

    return right({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email.toString(),
      },
    });
  }
}
