import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Static routes MUST come before dynamic :id route
  @Get('me')
  async getMe(@Req() req: any) {
    const user = await this.userService.getUserById(req.user.userId);
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    return user;
  }

  @Get('leaderboard/top')
  async getLeaderboard() {
    return this.userService.getLeaderboard();
  }

  @Put('profile')
  async updateProfile(
    @Req() req: any,
    @Body() body: {
      name?: string;
      bio?: string;
      avatarUrl?: string;
      preferredLang?: string;
      preferredTheme?: string;
    },
  ) {
    return this.userService.updateProfile(req.user.userId, body);
  }

  @Put('password')
  async changePassword(
    @Req() req: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.userService.getUserByEmail(req.user.email);
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    const valid = await bcrypt.compare(body.currentPassword, user.password);
    if (!valid) {
      return { error: 'Contraseña actual incorrecta' };
    }
    const hashed = await bcrypt.hash(body.newPassword, 10);
    await this.userService.changePassword(req.user.userId, hashed);
    return { message: 'Contraseña actualizada correctamente' };
  }

  // Dynamic route MUST come last to avoid catching static routes
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(Number(id));
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    return user;
  }
}
