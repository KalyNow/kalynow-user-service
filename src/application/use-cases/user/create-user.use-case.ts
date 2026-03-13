import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories';
import { User } from '../../../domain/entities';
import { CreateUserDto } from '../../dtos/user';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`Email ${dto.email} is already in use`);
    }
    return this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash: '',
      role: UserRole.BUYER,
    });
  }
}
