import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
      throw new Error('Credenciales inválidas');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Credenciales inválidas');
    }
    // No devolver password
    const { password: _, ...userData } = user;
    return userData;
  }
} 