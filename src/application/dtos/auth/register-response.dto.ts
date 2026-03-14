import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ example: 'Account created. Check your email to verify your account.' })
  message: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  /**
   * Returned only in non-production environments for easier testing.
   * In production, this would be sent via email only.
   */
  @ApiProperty({ required: false, description: 'Dev only — verification token' })
  verificationToken?: string;
}
