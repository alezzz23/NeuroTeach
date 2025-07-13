import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.userService.getUserByEmail(email);
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }
    const hashed = await bcrypt.hash(password, 10);
    return this.userService.createUser({ name, email, password: hashed });
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    // No devolver password
    const { password: _, ...userData } = user;
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return { access_token, user: userData };
  }
}
 