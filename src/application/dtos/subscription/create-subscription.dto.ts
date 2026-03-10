import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan } from '../../../domain/entities/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: SubscriptionPlan, example: SubscriptionPlan.BASIC })
  @IsEnum(SubscriptionPlan)
  @IsNotEmpty()
  plan: SubscriptionPlan;

  @ApiPropertyOptional({ example: '2025-12-31T00:00:00.000Z' })
  @IsOptional()
  endDate?: Date;
}
