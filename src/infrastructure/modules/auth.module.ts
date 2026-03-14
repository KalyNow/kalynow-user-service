import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from './user.module';
import { RefreshTokenRepository } from '../repositories/auth/refresh-token.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories';
import {
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  RegisterUseCase,
  VerifyTokenUseCase,
  VerifyAccountUseCase,
} from '../../application/use-cases/auth';
import { AuthController } from '../../interfaces/http/controllers/auth.controller';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { issuer: 'kalynow-user-service' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository,
    },
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    VerifyTokenUseCase,
    VerifyAccountUseCase,
    LogoutUseCase,
  ],
  exports: [JwtModule],
})
export class AuthModule { }
