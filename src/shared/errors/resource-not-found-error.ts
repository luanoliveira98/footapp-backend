import type { UseCaseError } from './use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  public readonly code = 'resource_not_found';

  constructor() {
    super('Resource not found');
  }
}
