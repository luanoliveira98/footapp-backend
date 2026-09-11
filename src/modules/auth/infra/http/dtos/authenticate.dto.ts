import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

export const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export class AuthenticateRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  email!: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description: 'Password',
  })
  password!: string;
}

export class AuthenticateResponseDto {
  @ApiProperty({ description: 'App access token' })
  access_token!: string;
}
