import type { UseCaseError } from '@/shared/errors/use-case-error';

export class EmailAlreadyExistsError extends Error implements UseCaseError {
  public readonly code = 'email_already_exists';

  constructor(identifier?: string) {
    super(`The email <${identifier}> already exists`);
  }
}
