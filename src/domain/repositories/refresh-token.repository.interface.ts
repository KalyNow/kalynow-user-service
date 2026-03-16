import { RefreshToken } from '../entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  create(data: { userId: string; token: string; expiresAt: Date }): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  deleteByToken(token: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}

export const REFRESH_TOKEN_REPOSITORY = Symbol('IRefreshTokenRepository');
