import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtVerifyResult {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Called by Traefik forwardAuth on GET /auth/verify.
 * Returns 200 + X-User-* headers if the JWT is valid, 401 otherwise.
 */
@Injectable()
export class VerifyTokenUseCase {
  constructor(private readonly jwtService: JwtService) { }

  execute(token: string): JwtVerifyResult {
    try {
      return this.jwtService.verify<JwtVerifyResult>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
