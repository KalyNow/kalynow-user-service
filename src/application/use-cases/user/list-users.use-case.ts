import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories';
import { User } from '../../../domain/entities';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
