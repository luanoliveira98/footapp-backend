import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { EnvService } from '@/infra/env/env.service';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        const isTest = env.get('NODE_ENV') === 'test';

        return {
          pinoHttp: {
            level: isTest ? 'silent' : 'info',
            genReqId: (req: Request) =>
              req.headers['x-correlation-id'] || randomUUID(),
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'res.headers["set-cookie"]',
                'body.password',
                'body.refreshToken',
              ],
              censor: '[REDACTED]',
            },
            transport:
              env.get('NODE_ENV') !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                      colorize: true,
                    },
                  }
                : undefined,
          },
        };
      },
    }),
  ],
})
export class LoggingModule {}
