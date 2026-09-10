import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordMessage =
  'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';

export const registerAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().regex(passwordRegex, passwordMessage),
});

export class ResgiterAccountDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Unique email address',
  })
  email!: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description: passwordMessage,
  })
  password!: string;
}
