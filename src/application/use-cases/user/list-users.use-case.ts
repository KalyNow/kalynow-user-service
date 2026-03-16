import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories';
import { User } from '../../../domain/entities';
import { PaginatedResultDto, PaginationQueryDto } from '../../dtos/common/paginated-result.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(query: PaginationQueryDto): Promise<PaginatedResultDto<User>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userRepository.findAll({ skip, take: limit, search: query.search }),
      this.userRepository.count(query.search),
    ]);

    return new PaginatedResultDto(data, total, page, limit);
  }
}
