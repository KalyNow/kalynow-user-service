import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories';
import { IRefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../../../domain/repositories';
import { User } from '../../../domain/entities';
import { AuthTokensDto } from '../../dtos/auth/auth-tokens.dto';

@Injectable()
export class VerifyAccountUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(token: string): Promise<AuthTokensDto> {
    const user = await this.userRepository.findByVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (user.isVerified) {
      throw new BadRequestException('Account is already verified');
    }

    await this.userRepository.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });

    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<AuthTokensDto> {
    const payload = { sub: user.id, email: user.email, role: user.role, verified: true };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const rawRefreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      jwtid: randomUUID(),
    });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create({
      userId: user.id,
      token: rawRefreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }
}
