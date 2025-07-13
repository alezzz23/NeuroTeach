import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { name: string; email: string; password: string }) {
    // Por defecto, el rol será 'user' si no se especifica
    return this.prisma.user.create({ data: { ...data, role: data['role'] || 'user' } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
