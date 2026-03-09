import { Injectable } from '@nestjs/common';
import { Subscription as PrismaSubscription } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ISubscriptionRepository } from '../../../domain/repositories';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../../../domain/entities';

function toSubscription(raw: PrismaSubscription): Subscription {
  return new Subscription({
    id: raw.id,
    userId: raw.userId,
    plan: raw.plan as unknown as SubscriptionPlan,
    status: raw.status as unknown as SubscriptionStatus,
    startDate: raw.startDate,
    endDate: raw.endDate ?? undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findUnique({ where: { id } });
    return sub ? toSubscription(sub) : null;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const subs = await this.prisma.subscription.findMany({ where: { userId } });
    return subs.map(toSubscription);
  }

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
    });
    return sub ? toSubscription(sub) : null;
  }

  async create(
    data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Subscription> {
    const sub = await this.prisma.subscription.create({
      data: {
        userId: data.userId,
        plan: data.plan as unknown as PrismaSubscription['plan'],
        status: data.status as unknown as PrismaSubscription['status'],
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return toSubscription(sub);
  }

  async update(
    id: string,
    data: Partial<Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Subscription> {
    const sub = await this.prisma.subscription.update({
      where: { id },
      data: {
        ...(data.plan !== undefined && {
          plan: data.plan as unknown as PrismaSubscription['plan'],
        }),
        ...(data.status !== undefined && {
          status: data.status as unknown as PrismaSubscription['status'],
        }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
      },
    });
    return toSubscription(sub);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subscription.delete({ where: { id } });
  }
}

