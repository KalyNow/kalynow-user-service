import { Device } from '../entities/device.entity';

export interface IDeviceRepository {
  findById(id: string): Promise<Device | null>;
  findByUserId(userId: string): Promise<Device[]>;
  findByToken(token: string): Promise<Device | null>;
  create(device: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>): Promise<Device>;
  update(id: string, data: Partial<Omit<Device, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Device>;
  delete(id: string): Promise<void>;
}

export const DEVICE_REPOSITORY = Symbol('IDeviceRepository');
