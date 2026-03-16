import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories';
import {
  REFRESH_TOKEN_REPOSITORY,
  IRefreshTokenRepository,
} from '../../../domain/repositories';
import { User } from '../../../domain/entities';
import { LoginDto } from '../../dtos/auth/login.dto';
import { AuthTokensDto } from '../../dtos/auth/auth-tokens.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(dto: LoginDto): Promise<AuthTokensDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Account not verified. Please check your email.');
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<AuthTokensDto> {
    const payload = { sub: user.id, email: user.email, role: user.role, verified: true };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const rawRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create({
      userId: user.id,
      token: rawRefreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }
}
