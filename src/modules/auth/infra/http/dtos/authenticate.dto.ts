import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

export const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

export class AuthenticateRequestDto implements AuthenticateBodySchema {
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
