import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    await this.userRepository.delete(id);
  }
}
