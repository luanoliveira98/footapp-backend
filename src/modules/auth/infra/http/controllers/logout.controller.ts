import { CurrentUser } from '@/infra/authentication/decorators/current-user';
import { JwtAuthGuard } from '@/infra/authentication/guards/jwt-auth.guard';
import { LogoutUseCase } from '@/modules/auth/domain/use-cases/logout.use-case';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { UserPayload } from '@/infra/authentication/strategies/jwt-strategy';
import {
  Cookies,
  type CookiesPayload,
} from '@/infra/authentication/decorators/cookies';
import type { Response } from 'express';

@ApiTags('Sessions')
@Controller('/sessions')
export class LogoutController {
  constructor(private readonly logout: LogoutUseCase) {}

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Logout an user' })
  @ApiResponse({ status: 204, description: 'User successfully logged out' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Cookies() cookies: CookiesPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = cookies.refresh_token;
    const userId = user.sub;

    const result = await this.logout.execute({ refreshToken, userId });

    if (result.isLeft()) {
      const error = result.value as unknown;

      const errorMsg = error instanceof Error ? error.message : String(error);

      throw new BadRequestException(errorMsg);
    }

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
  }
}
