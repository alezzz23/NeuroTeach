import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { VirtualLabsService, VirtualLab, LabProgress } from './virtual-labs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export interface CreateLabProgressDto {
  labId: number;
  currentStep: number;
  completedSteps: number[];
  code: string;
  timeSpent: number;
}

export interface ValidateCodeDto {
  code: string;
  stepId: number;
  labId: number;
}

export interface ExecuteCodeDto {
  code: string;
  language: string;
}

@Controller('virtual-labs')
@UseGuards(JwtAuthGuard)
export class VirtualLabsController {
  constructor(private readonly virtualLabsService: VirtualLabsService) {}

  @Get()
  async getAllLabs(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string
  ): Promise<VirtualLab[]> {
    try {
      if (category && category !== 'all') {
        return await this.virtualLabsService.getLabsByCategory(category);
      }
      
      if (difficulty) {
        return await this.virtualLabsService.getLabsByDifficulty(difficulty);
      }
      
      return await this.virtualLabsService.getAllLabs();
    } catch (error) {
      throw new HttpException(
        'Error al obtener los laboratorios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('statistics')
  async getLabStatistics() {
    try {
      return await this.virtualLabsService.getLabStatistics();
    } catch (error) {
      throw new HttpException(
        'Error al obtener estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getLabById(@Param('id', ParseIntPipe) id: number): Promise<VirtualLab> {
    try {
      const lab = await this.virtualLabsService.getLabById(id);
      
      if (!lab) {
        throw new HttpException(
          'Laboratorio no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      
      return lab;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el laboratorio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/progress')
  async getLabProgress(
    @Param('id', ParseIntPipe) labId: number,
    @Request() req
  ): Promise<LabProgress | null> {
    try {
      const userId = req.user.userId;
      return await this.virtualLabsService.getUserLabProgress(userId, labId);
    } catch (error) {
      throw new HttpException(
        'Error al obtener el progreso del laboratorio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/progress')
  async saveLabProgress(
    @Param('id', ParseIntPipe) labId: number,
    @Body() progressData: CreateLabProgressDto,
    @Request() req
  ): Promise<LabProgress> {
    try {
      const userId = req.user.userId;
      
      const progress = {
        ...progressData,
        userId,
        labId
      };
      
      return await this.virtualLabsService.saveLabProgress(progress);
    } catch (error) {
      throw new HttpException(
        'Error al guardar el progreso del laboratorio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('validate-code')
  async validateCode(@Body() validateData: ValidateCodeDto): Promise<{
    success: boolean;
    errors: string[];
  }> {
    try {
      const { code, stepId, labId } = validateData;
      
      // Obtener el laboratorio y el paso específico
      const lab = await this.virtualLabsService.getLabById(labId);
      
      if (!lab) {
        throw new HttpException(
          'Laboratorio no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      
      const step = lab.steps.find(s => s.id === stepId);
      
      if (!step) {
        throw new HttpException(
          'Paso del laboratorio no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      
      return await this.virtualLabsService.validateCode(code, step.validation);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al validar el código',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('execute-code')
  async executeCode(@Body() executeData: ExecuteCodeDto): Promise<{
    output: string;
    error?: string;
  }> {
    try {
      const { code, language } = executeData;
      
      if (!code || !language) {
        throw new HttpException(
          'Código y lenguaje son requeridos',
          HttpStatus.BAD_REQUEST
        );
      }
      
      return await this.virtualLabsService.executeCode(code, language);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al ejecutar el código',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/steps/:stepId')
  async getLabStep(
    @Param('id', ParseIntPipe) labId: number,
    @Param('stepId', ParseIntPipe) stepId: number
  ) {
    try {
      const lab = await this.virtualLabsService.getLabById(labId);
      
      if (!lab) {
        throw new HttpException(
          'Laboratorio no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      
      const step = lab.steps.find(s => s.id === stepId);
      
      if (!step) {
        throw new HttpException(
          'Paso del laboratorio no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      
      return step;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el paso del laboratorio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id/complete')
  async completeLab(
    @Param('id', ParseIntPipe) labId: number,
    @Request() req
  ): Promise<{ message: string; completedAt: Date }> {
    try {
      const userId = req.user.userId;
      
      // Verificar que el laboratorio existe
      const lab = await this.virtualLabsService.getLabById(labId);
      
      if (!lab) {
        throw new HttpException(
          'Laboratorio no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      
      // Marcar como completado
      const completedAt = new Date();
      
      await this.virtualLabsService.saveLabProgress({
        userId,
        labId,
        completedAt,
        currentStep: lab.steps.length,
        completedSteps: lab.steps.map(step => step.id)
      });
      
      return {
        message: 'Laboratorio completado exitosamente',
        completedAt
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al completar el laboratorio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user/progress')
  async getUserProgress(@Request() req) {
    try {
      const userId = req.user.userId;
      
      // Mock implementation - en el futuro esto consultará la base de datos
      return {
        userId,
        totalLabsStarted: 2,
        totalLabsCompleted: 1,
        totalTimeSpent: 45, // minutos
        recentLabs: [
          {
            labId: 1,
            title: 'Introducción a Python',
            progress: 100,
            completedAt: new Date()
          },
          {
            labId: 2,
            title: 'HTML y CSS Básico',
            progress: 33,
            lastAccessed: new Date()
          }
        ],
        skillsProgress: {
          python: 75,
          html: 40,
          css: 30,
          javascript: 0,
          sql: 0
        }
      };
    } catch (error) {
      throw new HttpException(
        'Error al obtener el progreso del usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}