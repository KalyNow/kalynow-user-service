import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Headers,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import {
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RegisterUseCase,
  VerifyTokenUseCase,
} from '../../../application/use-cases/auth';
import { LoginDto } from '../../../application/dtos/auth/login.dto';
import { RegisterDto } from '../../../application/dtos/auth/register.dto';
import { RefreshTokenDto } from '../../../application/dtos/auth/refresh-token.dto';
import { AuthTokensDto } from '../../../application/dtos/auth/auth-tokens.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyTokenUseCase: VerifyTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthTokensDto })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  register(@Body() dto: RegisterDto): Promise<AuthTokensDto> {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto): Promise<AuthTokensDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: AuthTokensDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokensDto> {
    return this.refreshTokenUseCase.execute(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout (invalidate refresh token)' })
  @ApiResponse({ status: 204 })
  logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.logoutUseCase.execute(dto.refreshToken);
  }

  /**
   * Called by Traefik forwardAuth middleware.
   * Validates the Bearer token and responds with:
   *   200 + X-User-Id, X-User-Email, X-User-Role headers → request forwarded
   *   401 → request blocked by Traefik
   */
  @Get('verify')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify JWT — used by Traefik forwardAuth' })
  @ApiResponse({ status: 200, description: 'Token valid' })
  @ApiResponse({ status: 401, description: 'Token invalid or missing' })
  verify(
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) res: Response,
  ): void {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = authHeader.slice(7);
    const payload = this.verifyTokenUseCase.execute(token);

    res.setHeader('X-User-Id', payload.sub);
    res.setHeader('X-User-Email', payload.email);
    res.setHeader('X-User-Role', payload.role);
  }
}
