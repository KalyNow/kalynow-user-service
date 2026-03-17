import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { IRefreshTokenRepository } from '../../../domain/repositories';
import { RefreshToken } from '../../../domain/entities';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    // Generate a unique tokenId for lookups
    const tokenId = randomUUID();
    // Hash the token before storing (bcrypt with 10 rounds)
    const hashedToken = await bcrypt.hash(data.token, 10);
    const record = await this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenId,
        token: hashedToken,
        expiresAt: data.expiresAt,
      },
    });
    return new RefreshToken(record);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    // Extract tokenId from JWT (first part of token before first dot)
    // JWT format: header.payload.signature
    // We'll extract and use tokenId from the payload
    try {
      // Split JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode payload (without verification, just to get tokenId)
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf8'),
      );
      const tokenId = payload.jti;

      if (!tokenId) {
        return null;
      }

      // Quick lookup by tokenId, then verify hash
      const record = await this.prisma.refreshToken.findUnique({
        where: { tokenId },
      });

      if (!record) {
        return null;
      }

      // Verify the hashed token matches
      const isValid = await bcrypt.compare(token, record.token);
      if (!isValid) {
        return null;
      }

      return new RefreshToken(record);
    } catch {
      return null;
    }
  }

  async deleteByToken(token: string): Promise<void> {
    try {
      // Extract tokenId from JWT payload
      const parts = token.split('.');
      if (parts.length !== 3) {
        return;
      }

      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf8'),
      );
      const tokenId = payload.jti;

      if (!tokenId) {
        return;
      }

      // Delete by tokenId
      await this.prisma.refreshToken.deleteMany({ where: { tokenId } });
    } catch {
      // Silently fail on invalid token format
    }
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}

