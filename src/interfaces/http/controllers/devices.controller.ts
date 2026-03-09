import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetDevicesByUserUseCase,
  RegisterDeviceUseCase,
} from '../../../application/use-cases/device';
import { CreateDeviceDto } from '../../../application/dtos/device';
import { Device } from '../../../domain/entities/device.entity';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(
    private readonly registerDeviceUseCase: RegisterDeviceUseCase,
    private readonly getDevicesByUserUseCase: GetDevicesByUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a device' })
  @ApiResponse({ status: 201, description: 'Device registered', type: Device })
  register(@Body() dto: CreateDeviceDto): Promise<Device> {
    return this.registerDeviceUseCase.execute(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get devices for a user' })
  @ApiResponse({ status: 200, description: 'User devices', type: [Device] })
  findByUser(@Param('userId') userId: string): Promise<Device[]> {
    return this.getDevicesByUserUseCase.execute(userId);
  }
}
