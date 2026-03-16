import { Injectable } from '@nestjs/common';
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
    const record = await this.prisma.refreshToken.create({ data });
    return new RefreshToken(record);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    return record ? new RefreshToken(record) : null;
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
