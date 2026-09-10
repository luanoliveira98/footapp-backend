import type { UseCaseError } from '@/shared/errors/use-case-error';

export class WrongCredentialsError extends Error implements UseCaseError {
  public readonly code = 'wrong_credentials';

  constructor() {
    super(`Credentials are not valid`);
  }
}
