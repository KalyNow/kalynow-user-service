import { Inject, Injectable } from '@nestjs/common';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories';
import { Subscription } from '../../../domain/entities';
import { SubscriptionStatus } from '../../../domain/entities/subscription.entity';
import { CreateSubscriptionDto } from '../../dtos/subscription';

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionRepository.create({
      userId: dto.userId,
      plan: dto.plan,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: dto.endDate,
    });
  }
}
