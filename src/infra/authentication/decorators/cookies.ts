import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import z from 'zod';

const cookiesPayloadSchema = z.object({
  refresh_token: z.uuid(),
});

export type CookiesPayload = z.infer<typeof cookiesPayloadSchema>;

interface CookiesRequest extends Request {
  cookies: CookiesPayload;
}

export const Cookies = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<CookiesRequest>();
    cookiesPayloadSchema.parse(request.cookies);

    return request.cookies;
  },
);
