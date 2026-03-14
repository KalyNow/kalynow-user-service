import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories';
import { UserRole } from '../../../domain/entities';
import { RegisterDto } from '../../dtos/auth/register.dto';
import { RegisterResponseDto } from '../../dtos/auth/register-response.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(dto: RegisterDto): Promise<RegisterResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`Email ${dto.email} is already in use`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      role: UserRole.BUYER,
      isVerified: false,
      verificationToken,
    });

    const response: RegisterResponseDto = {
      message: 'Account created. Check your email to verify your account.',
      email: dto.email,
    };

    // Expose token in non-production for easier testing
    if (process.env.NODE_ENV !== 'production') {
      response.verificationToken = verificationToken;
    }

    return response;
  }
}
