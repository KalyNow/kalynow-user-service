import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './infrastructure/modules/user.module';
import { SubscriptionModule } from './infrastructure/modules/subscription.module';
import { DeviceModule } from './infrastructure/modules/device.module';
import { AuthModule } from './infrastructure/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    SubscriptionModule,
    DeviceModule,
    AuthModule,
  ],
})
export class AppModule { }
