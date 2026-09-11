import { RegisterAccountUseCase } from '@/modules/auth/domain/use-cases/register-account.use-case';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  registerAccountBodySchema,
  ResgiterAccountRequestDto,
} from '../dtos/register-account.dto';
import { Public } from '@/shared/decorators/public';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import { EmailAlreadyExistsError } from '@/modules/auth/domain/errors/email-already-exists.error';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller('/accounts')
export class RegisterAccountController {
  constructor(private readonly registerAccount: RegisterAccountUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({ status: 201, description: 'User successfully created ' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @UsePipes(new ZodValidationPipe(registerAccountBodySchema))
  async handle(@Body() body: ResgiterAccountRequestDto) {
    const { name, email, password } = body;

    const result = await this.registerAccount.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
