import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { name: string; email: string }) {
    return this.prisma.user.create({ data });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
