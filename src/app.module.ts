import { Module } from '@nestjs/common';
import { UserModule } from './infrastructure/modules/user.module';
import { SubscriptionModule } from './infrastructure/modules/subscription.module';
import { DeviceModule } from './infrastructure/modules/device.module';
import { UsersController } from './interfaces/http/controllers/users.controller';
import { SubscriptionsController } from './interfaces/http/controllers/subscriptions.controller';
import { DevicesController } from './interfaces/http/controllers/devices.controller';

@Module({
  imports: [UserModule, SubscriptionModule, DeviceModule],
  controllers: [UsersController, SubscriptionsController, DevicesController],
})
export class AppModule {}
