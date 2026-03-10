import { Inject, Injectable } from '@nestjs/common';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories';
import { Subscription } from '../../../domain/entities';

@Injectable()
export class GetSubscriptionsByUserUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.findByUserId(userId);
  }
}
