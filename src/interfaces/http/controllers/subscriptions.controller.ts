import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateSubscriptionUseCase,
  GetSubscriptionsByUserUseCase,
  UpdateSubscriptionUseCase,
} from '../../../application/use-cases/subscription';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../../../application/dtos/subscription';
import { Subscription } from '../../../domain/entities/subscription.entity';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly getSubscriptionsByUserUseCase: GetSubscriptionsByUserUseCase,
    private readonly updateSubscriptionUseCase: UpdateSubscriptionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created', type: Subscription })
  create(@Body() dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.createSubscriptionUseCase.execute(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get subscriptions for a user' })
  @ApiResponse({ status: 200, description: 'User subscriptions', type: [Subscription] })
  findByUser(@Param('userId') userId: string): Promise<Subscription[]> {
    return this.getSubscriptionsByUserUseCase.execute(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiResponse({ status: 200, description: 'Subscription updated', type: Subscription })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.updateSubscriptionUseCase.execute(id, dto);
  }
}
