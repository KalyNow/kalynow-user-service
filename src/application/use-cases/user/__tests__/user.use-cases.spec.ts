import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_REPOSITORY } from '../../../../domain/repositories';
import { User } from '../../../../domain/entities';
import { CreateUserUseCase } from '../create-user.use-case';
import { GetUserUseCase } from '../get-user.use-case';
import { ListUsersUseCase } from '../list-users.use-case';
import { UpdateUserUseCase } from '../update-user.use-case';
import { DeleteUserUseCase } from '../delete-user.use-case';

const mockUser: User = new User({
  id: 'uuid-1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('User Use Cases', () => {
  let createUserUseCase: CreateUserUseCase;
  let getUserUseCase: GetUserUseCase;
  let listUsersUseCase: ListUsersUseCase;
  let updateUserUseCase: UpdateUserUseCase;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        GetUserUseCase,
        ListUsersUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    createUserUseCase = module.get(CreateUserUseCase);
    getUserUseCase = module.get(GetUserUseCase);
    listUsersUseCase = module.get(ListUsersUseCase);
    updateUserUseCase = module.get(UpdateUserUseCase);
    deleteUserUseCase = module.get(DeleteUserUseCase);

    jest.clearAllMocks();
  });

  describe('CreateUserUseCase', () => {
    it('should create and return a user', async () => {
      mockUserRepository.create.mockResolvedValue(mockUser);
      const result = await createUserUseCase.execute({
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });

  describe('GetUserUseCase', () => {
    it('should return a user when found', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      const result = await getUserUseCase.execute('uuid-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(getUserUseCase.execute('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('ListUsersUseCase', () => {
    it('should return a list of users', async () => {
      mockUserRepository.findAll.mockResolvedValue([mockUser]);
      const result = await listUsersUseCase.execute();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('UpdateUserUseCase', () => {
    it('should update and return the user', async () => {
      const updated = new User({ ...mockUser, name: 'Updated Name' });
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updated);
      const result = await updateUserUseCase.execute('uuid-1', {
        name: 'Updated Name',
      });
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(
        updateUserUseCase.execute('not-found', { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteUserUseCase', () => {
    it('should delete the user without error', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(undefined);
      await expect(deleteUserUseCase.execute('uuid-1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(deleteUserUseCase.execute('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
