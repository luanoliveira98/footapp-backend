import { AuthenticateUseCase } from '@/modules/auth/domain/use-cases/authenticate.use-case';
import { Public } from '@/shared/decorators/public';
import { ZodValidationPipe } from '@/shared/pipes/zod-validation.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  authenticateBodySchema,
  AuthenticateResponseDto,
  type AuthenticateRequestDto,
} from '../dtos/authenticate.dto';
import { WrongCredentialsError } from '@/modules/auth/domain/errors/wrong-credentials.error';
import type { Response } from 'express';

@ApiTags('Accounts')
@Controller('/sessions')
export class AuthenticateController {
  constructor(private readonly authenticate: AuthenticateUseCase) {}

  @Post()
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate an user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: AuthenticateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Wrong credentials' })
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthenticateResponseDto> {
    const { email, password } = body;

    const result = await this.authenticate.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    res.cookie('refreshToken', result.value.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    return { access_token: result.value.accessToken };
  }
}
