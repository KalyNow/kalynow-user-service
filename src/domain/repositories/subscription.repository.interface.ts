import { Subscription } from '../entities/subscription.entity';

type SubscriptionData = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isExpired'>;

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription[]>;
  findActiveByUserId(userId: string): Promise<Subscription | null>;
  create(subscription: SubscriptionData): Promise<Subscription>;
  update(id: string, data: Partial<SubscriptionData>): Promise<Subscription>;
  delete(id: string): Promise<void>;
}

export const SUBSCRIPTION_REPOSITORY = Symbol('ISubscriptionRepository');
