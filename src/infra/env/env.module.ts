import { Global, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'test',
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
