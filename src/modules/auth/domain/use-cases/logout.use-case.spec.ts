import { makeSessionFactory } from 'test/factories/make-session';
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions.repository';
import { LogoutUseCase } from './logout.use-case';
import { faker } from '@faker-js/faker';

describe('LogoutUseCase', () => {
  let sut: LogoutUseCase;
  let inMemorySessionsRepository: InMemorySessionsRepository;

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository();
    sut = new LogoutUseCase(inMemorySessionsRepository);
  });

  it('should logout an user', async () => {
    const session = makeSessionFactory();

    await inMemorySessionsRepository.create(session);

    const response = await sut.execute({
      refreshToken: session.refreshToken.toString(),
      userId: session.userId.toString(),
    });

    expect(response.isRight()).toBe(true);
    expect(response.value).toBeNull();

    const sessionsOnDatabase = await inMemorySessionsRepository.findByUserId(
      session.userId.toString(),
    );

    expect(sessionsOnDatabase).toHaveLength(0);
  });

  it('should silently pass if session does not exist', async () => {
    const session = makeSessionFactory();

    await inMemorySessionsRepository.create(session);

    const response = await sut.execute({
      refreshToken: 'inexistent-refresh-token',
      userId: faker.string.uuid(),
    });

    expect(response.isRight()).toBe(true);
    expect(response.value).toBeNull();

    const sessionsOnDatabase = await inMemorySessionsRepository.findByUserId(
      session.userId.toString(),
    );

    expect(sessionsOnDatabase).toHaveLength(1);
  });

  it('should silently pass if session belongs to another user', async () => {
    const session = makeSessionFactory();

    await inMemorySessionsRepository.create(session);

    const response = await sut.execute({
      refreshToken: session.refreshToken.toString(),
      userId: faker.string.uuid(),
    });

    expect(response.isRight()).toBe(true);
    expect(response.value).toBeNull();

    const sessionsOnDatabase = await inMemorySessionsRepository.findByUserId(
      session.userId.toString(),
    );

    expect(sessionsOnDatabase).toHaveLength(1);
  });
});
