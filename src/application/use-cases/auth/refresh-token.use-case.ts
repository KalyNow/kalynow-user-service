import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  REFRESH_TOKEN_REPOSITORY,
  IRefreshTokenRepository,
  USER_REPOSITORY,
  IUserRepository,
} from '../../../domain/repositories';
import { User } from '../../../domain/entities';
import { AuthTokensDto } from '../../dtos/auth/auth-tokens.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(token: string): Promise<AuthTokensDto> {
    const stored = await this.refreshTokenRepository.findByToken(token);
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Rotate: delete old, issue new
    await this.refreshTokenRepository.deleteByToken(token);
    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<AuthTokensDto> {
    const newPayload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
