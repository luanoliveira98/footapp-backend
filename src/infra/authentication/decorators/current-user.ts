import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserPayload } from '../strategies/jwt-strategy';
import type { Request } from 'express';

interface AuthenticateRequest extends Request {
  user: UserPayload;
}

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticateRequest>();

    return request.user;
  },
);
