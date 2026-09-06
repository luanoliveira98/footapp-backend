import type { UseCaseError } from '@/shared/errors/use-case-error';

export class InvalidEmailError extends Error implements UseCaseError {
  public readonly code = 'invalid_email';

  constructor(identifier?: string) {
    super(`The email <${identifier}> is invalid`);
    this.name = 'InvalidEmailError';
  }
}
