import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SubscriptionRepository } from '../repositories/subscription/subscription.repository';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories';
import {
  CreateSubscriptionUseCase,
  GetSubscriptionsByUserUseCase,
  UpdateSubscriptionUseCase,
} from '../../application/use-cases/subscription';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionRepository,
    },
    CreateSubscriptionUseCase,
    GetSubscriptionsByUserUseCase,
    UpdateSubscriptionUseCase,
  ],
  exports: [
    SUBSCRIPTION_REPOSITORY,
    CreateSubscriptionUseCase,
    GetSubscriptionsByUserUseCase,
    UpdateSubscriptionUseCase,
  ],
})
export class SubscriptionModule {}
