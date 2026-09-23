import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { Response } from 'express';
import type { ZodError } from 'zod';

@Catch(ZodValidationException)
export class ZodValidationFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const zodError = exception.getZodError() as ZodError;

    const cleanErrors = zodError.issues.reduce(
      (acc, issue) => {
        const path = issue.path.join('.');
        acc[path] = issue.message;
        return acc;
      },
      {} as Record<string, string>,
    );

    response.status(status).json({
      statusCode: status,
      message: 'Validation failed',
      errors: cleanErrors,
    });
  }
}
