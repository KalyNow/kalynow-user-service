import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../../domain/repositories';
import { Subscription } from '../../../domain/entities';
import { UpdateSubscriptionDto } from '../../dtos/subscription';

@Injectable()
export class UpdateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(id: string, dto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription)
      throw new NotFoundException(`Subscription with id ${id} not found`);
    return this.subscriptionRepository.update(id, dto);
  }
}
