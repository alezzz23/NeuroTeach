import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(Number(id));
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    return user;
  }

  @Post()
  async createUser(@Body() data: { name: string; email: string }) {
    return this.userService.createUser(data);
  }
}
