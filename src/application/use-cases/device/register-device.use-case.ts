import { Inject, Injectable } from '@nestjs/common';
import {
  IDeviceRepository,
  DEVICE_REPOSITORY,
} from '../../../domain/repositories';
import { Device } from '../../../domain/entities';
import { CreateDeviceDto } from '../../dtos/device';

@Injectable()
export class RegisterDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(dto: CreateDeviceDto): Promise<Device> {
    return this.deviceRepository.create(dto);
  }
}
