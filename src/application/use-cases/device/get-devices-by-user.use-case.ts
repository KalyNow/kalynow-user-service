import { Inject, Injectable } from '@nestjs/common';
import {
  IDeviceRepository,
  DEVICE_REPOSITORY,
} from '../../../domain/repositories';
import { Device } from '../../../domain/entities';

@Injectable()
export class GetDevicesByUserUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(userId: string): Promise<Device[]> {
    return this.deviceRepository.findByUserId(userId);
  }
}
