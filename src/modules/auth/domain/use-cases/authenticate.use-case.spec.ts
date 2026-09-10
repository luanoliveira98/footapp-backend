import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeUserFactory } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { WrongCredentialsError } from '../errors/wrong-credentials.error';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateUseCase } from './authenticate.use-case';
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions.repository';

describe('AuthenticateUseCase', () => {
  let sut: AuthenticateUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemorySessionsRepository: InMemorySessionsRepository;
  let fakeHasher: FakeHasher;
  let fakeEncrypter: FakeEncrypter;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemorySessionsRepository = new InMemorySessionsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      inMemorySessionsRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should authenticate an user', async () => {
    const password = faker.internet.password();
    const passwordHashed = await fakeHasher.hash(password);
    const user = makeUserFactory({ passwordHash: passwordHashed });

    await inMemoryUsersRepository.create(user);

    const response = await sut.execute({
      email: user.email.toString(),
      password,
    });

    const accessToken = await fakeEncrypter.encrypt({
      sub: user.id.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual({
      accessToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      refreshToken: expect.any(String),
    });

    const sessionsOnDatabase = await inMemorySessionsRepository.findByUserId(
      user.id.toString(),
    );

    expect(sessionsOnDatabase).toHaveLength(1);
  });

  it('should not authenticate an user with wrong password', async () => {
    const password = faker.internet.password();
    const passwordHashed = await fakeHasher.hash(password);
    const user = makeUserFactory({ passwordHash: passwordHashed });

    await inMemoryUsersRepository.create(user);

    const response = await sut.execute({
      email: user.email.toString(),
      password: 'wrong-password',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(WrongCredentialsError);

    const sessionsOnDatabase = await inMemorySessionsRepository.findByUserId(
      user.id.toString(),
    );

    expect(sessionsOnDatabase).toHaveLength(0);
  });

  it('should not authenticate an user with inexistent email', async () => {
    const response = await sut.execute({
      email: 'inexistent-email@email.com',
      password: faker.internet.password(),
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(WrongCredentialsError);

    const sessionsOnDatabase = await inMemorySessionsRepository.list();

    expect(sessionsOnDatabase).toHaveLength(0);
  });
});
