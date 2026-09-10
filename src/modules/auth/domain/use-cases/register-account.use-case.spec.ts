import { faker } from '@faker-js/faker';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { User } from '../entities/user';
import { Email } from '../value-objects/email';
import { EmailAlreadyExistsError } from '../errors/email-already-exists.error';
import { RegisterAccountUseCase } from './register-account.use-case';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InvalidEmailError } from '../errors/invalid-email.error';

describe('RegisterAccountUseCase', () => {
  let sut: RegisterAccountUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let fakeHasher: FakeHasher;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterAccountUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should register a new account', async () => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await sut.execute(user);

    if (response.isLeft()) throw new Error('Should be right');

    expect(response.isRight()).toBe(true);
    expect(response.value.user).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
      name: user.name,
      email: user.email,
    });

    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    const hashedPassword = await fakeHasher.hash(user.password);

    if (response.isLeft()) throw Error('Should be right');

    expect(createdUser?.id.toString()).toBe(response.value.user.id);
    expect(createdUser?.name).toBe(user.name);
    expect(createdUser?.email.toString()).toBe(user.email);
    expect(createdUser?.passwordHash).toBe(hashedPassword);
  });

  it('should not register an account with an existing email', async () => {
    const passwordHashed = await fakeHasher.hash(faker.internet.password());

    const email = Email.restore(faker.internet.email());

    const existingUser = User.create({
      name: faker.person.fullName(),
      email,
      passwordHash: passwordHashed,
    });

    await inMemoryUsersRepository.create(existingUser);

    const user = {
      name: faker.person.fullName(),
      email: existingUser.email.toString(),
      password: faker.internet.password(),
    };

    const response = await sut.execute(user);

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(EmailAlreadyExistsError);
  });

  it('should not register an account with an invalid email', async () => {
    const user = {
      name: faker.person.fullName(),
      email: 'invalid-email',
      password: faker.internet.password(),
    };

    const response = await sut.execute(user);

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidEmailError);
  });
});
