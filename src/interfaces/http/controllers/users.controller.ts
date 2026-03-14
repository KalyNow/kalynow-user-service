import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
} from '../../../application/use-cases/user';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../../application/dtos/user';
import {
  PaginatedResultDto,
  PaginationQueryDto,
} from '../../../application/dtos/common/paginated-result.dto';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) { }

  /** ADMIN only — create a user directly (bypasses registration flow) */
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(dto);
  }

  /** ADMIN only — list all users */
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List users with pagination and search (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Paginated list of users', type: PaginatedResultDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResultDto<User>> {
    return this.listUsersUseCase.execute(query);
  }

  /** Any authenticated user — returns their own profile */
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  getMe(@CurrentUser() user: JwtPayload): Promise<User> {
    return this.getUserUseCase.execute(user.sub);
  }

  /** ADMIN or SELLER — get any user; BUYER can only see their own profile (enforce in use-case) */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: 'Get user by id (ADMIN, SELLER)' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.getUserUseCase.execute(id);
  }

  /** ADMIN only — update any user */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a user (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.updateUserUseCase.execute(id, dto);
  }

  /** ADMIN only — delete a user */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user (ADMIN only)' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
