import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository';

describe('RegisterAccountUseCase', () => {
  let sut: RegisterAccountUseCase;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new RegisterAccountUseCase(inMemoryUserRepository);
  });
});
