import { Injectable } from '@nestjs/common';
import { Device as PrismaDevice } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { IDeviceRepository } from '../../../domain/repositories';
import { Device, DeviceType } from '../../../domain/entities';

function toDevice(raw: PrismaDevice): Device {
  return new Device({
    id: raw.id,
    userId: raw.userId,
    deviceType: raw.deviceType as unknown as DeviceType,
    token: raw.token,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  });
}

@Injectable()
export class DeviceRepository implements IDeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Device | null> {
    const device = await this.prisma.device.findUnique({ where: { id } });
    return device ? toDevice(device) : null;
  }

  async findByUserId(userId: string): Promise<Device[]> {
    const devices = await this.prisma.device.findMany({ where: { userId } });
    return devices.map(toDevice);
  }

  async findByToken(token: string): Promise<Device | null> {
    const device = await this.prisma.device.findUnique({ where: { token } });
    return device ? toDevice(device) : null;
  }

  async create(
    data: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Device> {
    const device = await this.prisma.device.create({
      data: {
        userId: data.userId,
        deviceType: data.deviceType as unknown as PrismaDevice['deviceType'],
        token: data.token,
      },
    });
    return toDevice(device);
  }

  async update(
    id: string,
    data: Partial<Omit<Device, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Device> {
    const device = await this.prisma.device.update({
      where: { id },
      data: {
        ...(data.deviceType !== undefined && {
          deviceType: data.deviceType as unknown as PrismaDevice['deviceType'],
        }),
        ...(data.token !== undefined && { token: data.token }),
      },
    });
    return toDevice(device);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.device.delete({ where: { id } });
  }
}

