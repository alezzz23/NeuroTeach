import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LearnService } from './learn.service';
import { runCodeMvp, validateCodeMvp } from './learn.runtime';

@Controller('learn')
@UseGuards(JwtAuthGuard)
export class LearnController {
  constructor(private readonly learnService: LearnService) {}

  @Get('tracks')
  async listTracks() {
    return this.learnService.listTracks();
  }

  @Get('tracks-with-progress')
  async listTracksWithProgress(@Request() req) {
    const userId = req.user.userId;
    return this.learnService.listTracksWithProgress(userId);
  }

  @Get('dashboard-summary')
  async getDashboardSummary(@Request() req) {
    const userId = req.user.userId;
    return this.learnService.getDashboardLearningSummary(userId);
  }

  @Get('tracks/:slug')
  async getTrackBySlug(@Param('slug') slug: string) {
    const track = await this.learnService.getTrackBySlug(slug);
    if (!track || !track.isPublished) {
      throw new HttpException('Track no encontrado', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Get('tracks/:slug/progress')
  async getTrackProgress(@Param('slug') slug: string, @Request() req) {
    const userId = req.user.userId;
    const progress = await this.learnService.getTrackProgress(userId, slug);
    if (!progress) {
      throw new HttpException('Track no encontrado', HttpStatus.NOT_FOUND);
    }
    return progress;
  }

  @Get('exercises/:id')
  async getExerciseById(@Param('id', ParseIntPipe) id: number) {
    const exercise = await this.learnService.getExerciseById(id);
    if (!exercise) {
      throw new HttpException('Ejercicio no encontrado', HttpStatus.NOT_FOUND);
    }
    return exercise;
  }

  @Get('exercises/:id/progress')
  async getExerciseProgress(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.learnService.getExerciseProgress(userId, id);
  }

  @Post('exercises/:id/progress')
  async saveExerciseProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { code?: string; isCompleted?: boolean; score?: number },
    @Request() req,
  ) {
    const userId = req.user.userId;

    if (!body || typeof body !== 'object') {
      throw new HttpException('Body inválido', HttpStatus.BAD_REQUEST);
    }

    return this.learnService.saveExerciseProgress(userId, id, body);
  }

  @Post('exercises/:id/run')
  async runExercise(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { code?: string; submission?: unknown },
  ) {
    const exercise = await this.learnService.getExerciseById(id);
    if (!exercise) {
      throw new HttpException('Ejercicio no encontrado', HttpStatus.NOT_FOUND);
    }
    const code = String(body?.code ?? '');
    const submission = (body as any)?.submission;
    return await runCodeMvp(code, (exercise as any).language, submission, (exercise as any));
  }

  @Post('exercises/:id/validate')
  async validateExercise(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { code?: string; submission?: unknown },
  ) {
    const exercise = await this.learnService.getExerciseById(id);
    if (!exercise) {
      throw new HttpException('Ejercicio no encontrado', HttpStatus.NOT_FOUND);
    }
    const code = String(body?.code ?? '');
    const submission = (body as any)?.submission;
    return await validateCodeMvp(code, (exercise as any).validation, submission, (exercise as any));
  }
}
