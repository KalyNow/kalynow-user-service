export enum DeviceType {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  WEB = 'WEB',
}

export class Device {
  id: string;
  userId: string;
  deviceType: DeviceType;
  token: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Device>) {
    Object.assign(this, partial);
  }
}
