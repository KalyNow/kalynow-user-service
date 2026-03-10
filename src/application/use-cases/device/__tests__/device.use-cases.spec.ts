import { Test, TestingModule } from '@nestjs/testing';
import { DEVICE_REPOSITORY } from '../../../../domain/repositories';
import { Device, DeviceType } from '../../../../domain/entities';
import { RegisterDeviceUseCase } from '../register-device.use-case';
import { GetDevicesByUserUseCase } from '../get-devices-by-user.use-case';

const mockDevice: Device = new Device({
  id: 'device-uuid-1',
  userId: 'user-uuid-1',
  deviceType: DeviceType.IOS,
  token: 'push-token-abc123',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockDeviceRepository = {
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findByToken: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Device Use Cases', () => {
  let registerDeviceUseCase: RegisterDeviceUseCase;
  let getDevicesByUserUseCase: GetDevicesByUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterDeviceUseCase,
        GetDevicesByUserUseCase,
        { provide: DEVICE_REPOSITORY, useValue: mockDeviceRepository },
      ],
    }).compile();

    registerDeviceUseCase = module.get(RegisterDeviceUseCase);
    getDevicesByUserUseCase = module.get(GetDevicesByUserUseCase);

    jest.clearAllMocks();
  });

  describe('RegisterDeviceUseCase', () => {
    it('should register and return a device', async () => {
      mockDeviceRepository.create.mockResolvedValue(mockDevice);
      const result = await registerDeviceUseCase.execute({
        userId: 'user-uuid-1',
        deviceType: DeviceType.IOS,
        token: 'push-token-abc123',
      });
      expect(result).toEqual(mockDevice);
      expect(mockDeviceRepository.create).toHaveBeenCalledWith({
        userId: 'user-uuid-1',
        deviceType: DeviceType.IOS,
        token: 'push-token-abc123',
      });
    });
  });

  describe('GetDevicesByUserUseCase', () => {
    it('should return devices for a user', async () => {
      mockDeviceRepository.findByUserId.mockResolvedValue([mockDevice]);
      const result = await getDevicesByUserUseCase.execute('user-uuid-1');
      expect(result).toEqual([mockDevice]);
      expect(mockDeviceRepository.findByUserId).toHaveBeenCalledWith(
        'user-uuid-1',
      );
    });

    it('should return empty array when user has no devices', async () => {
      mockDeviceRepository.findByUserId.mockResolvedValue([]);
      const result = await getDevicesByUserUseCase.execute('user-uuid-1');
      expect(result).toEqual([]);
    });
  });
});
