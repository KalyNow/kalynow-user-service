import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '../repositories/user/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories';
import { JwtAuthGuard } from '../../interfaces/http/guards/jwt-auth.guard';
import { RolesGuard } from '../../interfaces/http/guards/roles.guard';
import {
  CreateUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../../application/use-cases/user';
import { UsersController } from '../../interfaces/http/controllers/users.controller';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { issuer: 'kalynow-user-service' },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    JwtAuthGuard,
    RolesGuard,
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [
    USER_REPOSITORY,
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule { }
