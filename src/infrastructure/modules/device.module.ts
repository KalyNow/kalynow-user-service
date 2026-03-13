import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DeviceRepository } from '../repositories/device/device.repository';
import { DEVICE_REPOSITORY } from '../../domain/repositories';
import {
  RegisterDeviceUseCase,
  GetDevicesByUserUseCase,
} from '../../application/use-cases/device';
import { DevicesController } from '../../interfaces/http/controllers/devices.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [DevicesController],
  providers: [
    {
      provide: DEVICE_REPOSITORY,
      useClass: DeviceRepository,
    },
    RegisterDeviceUseCase,
    GetDevicesByUserUseCase,
  ],
  exports: [
    DEVICE_REPOSITORY,
    RegisterDeviceUseCase,
    GetDevicesByUserUseCase,
  ],
})
export class DeviceModule { }
