import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SUBSCRIPTION_REPOSITORY } from '../../../../domain/repositories';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../../../../domain/entities';
import { CreateSubscriptionUseCase } from '../create-subscription.use-case';
import { GetSubscriptionsByUserUseCase } from '../get-subscriptions-by-user.use-case';
import { UpdateSubscriptionUseCase } from '../update-subscription.use-case';

const mockSubscription: Subscription = new Subscription({
  id: 'sub-uuid-1',
  userId: 'user-uuid-1',
  plan: SubscriptionPlan.BASIC,
  status: SubscriptionStatus.ACTIVE,
  startDate: new Date('2024-01-01'),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockSubscriptionRepository = {
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findActiveByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Subscription Use Cases', () => {
  let createSubscriptionUseCase: CreateSubscriptionUseCase;
  let getSubscriptionsByUserUseCase: GetSubscriptionsByUserUseCase;
  let updateSubscriptionUseCase: UpdateSubscriptionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSubscriptionUseCase,
        GetSubscriptionsByUserUseCase,
        UpdateSubscriptionUseCase,
        { provide: SUBSCRIPTION_REPOSITORY, useValue: mockSubscriptionRepository },
      ],
    }).compile();

    createSubscriptionUseCase = module.get(CreateSubscriptionUseCase);
    getSubscriptionsByUserUseCase = module.get(GetSubscriptionsByUserUseCase);
    updateSubscriptionUseCase = module.get(UpdateSubscriptionUseCase);

    jest.clearAllMocks();
  });

  describe('CreateSubscriptionUseCase', () => {
    it('should create and return a subscription', async () => {
      mockSubscriptionRepository.create.mockResolvedValue(mockSubscription);
      const result = await createSubscriptionUseCase.execute({
        userId: 'user-uuid-1',
        plan: SubscriptionPlan.BASIC,
      });
      expect(result).toEqual(mockSubscription);
      expect(mockSubscriptionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-uuid-1',
          plan: SubscriptionPlan.BASIC,
          status: SubscriptionStatus.ACTIVE,
        }),
      );
    });
  });

  describe('GetSubscriptionsByUserUseCase', () => {
    it('should return subscriptions for a user', async () => {
      mockSubscriptionRepository.findByUserId.mockResolvedValue([
        mockSubscription,
      ]);
      const result = await getSubscriptionsByUserUseCase.execute('user-uuid-1');
      expect(result).toEqual([mockSubscription]);
      expect(mockSubscriptionRepository.findByUserId).toHaveBeenCalledWith(
        'user-uuid-1',
      );
    });

    it('should return empty array when user has no subscriptions', async () => {
      mockSubscriptionRepository.findByUserId.mockResolvedValue([]);
      const result = await getSubscriptionsByUserUseCase.execute('user-uuid-1');
      expect(result).toEqual([]);
    });
  });

  describe('UpdateSubscriptionUseCase', () => {
    it('should update and return the subscription', async () => {
      const updated = new Subscription({
        ...mockSubscription,
        plan: SubscriptionPlan.PREMIUM,
      });
      mockSubscriptionRepository.findById.mockResolvedValue(mockSubscription);
      mockSubscriptionRepository.update.mockResolvedValue(updated);
      const result = await updateSubscriptionUseCase.execute('sub-uuid-1', {
        plan: SubscriptionPlan.PREMIUM,
      });
      expect(result.plan).toBe(SubscriptionPlan.PREMIUM);
    });

    it('should throw NotFoundException when subscription not found', async () => {
      mockSubscriptionRepository.findById.mockResolvedValue(null);
      await expect(
        updateSubscriptionUseCase.execute('not-found', {
          plan: SubscriptionPlan.PREMIUM,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
