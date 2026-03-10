import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories';
import { User } from '../../../domain/entities';
import { UpdateUserDto } from '../../dtos/user';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return this.userRepository.update(id, dto);
  }
}
