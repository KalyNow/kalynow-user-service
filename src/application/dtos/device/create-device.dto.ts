import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '../../../domain/entities/device.entity';

export class CreateDeviceDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: DeviceType, example: DeviceType.IOS })
  @IsEnum(DeviceType)
  @IsNotEmpty()
  deviceType: DeviceType;

  @ApiProperty({ example: 'device-push-notification-token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
