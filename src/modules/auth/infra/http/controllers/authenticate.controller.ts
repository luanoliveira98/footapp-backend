import { AuthenticateUseCase } from '@/modules/auth/domain/use-cases/authenticate.use-case';
import { Public } from '@/infra/authentication/decorators/public';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthenticateResponseDto,
  type AuthenticateRequestDto,
} from '../dtos/authenticate.dto';
import { WrongCredentialsError } from '@/modules/auth/domain/errors/wrong-credentials.error';
import type { Response } from 'express';

@ApiTags('Sessions')
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
  async handle(
    @Body() body: AuthenticateRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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

    res.cookie('refresh_token', result.value.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    return { access_token: result.value.accessToken };
  }
}
