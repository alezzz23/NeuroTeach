import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // GET /courses - Obtener todos los cursos
  @Get()
  async getAllCourses() {
    return this.courseService.getAllCourses();
  }

  // GET /courses/my-progress - Obtener cursos con progreso del usuario
  @Get('my-progress')
  async getMyCoursesProgress(@Request() req) {
    const userId = req.user.userId;
    return this.courseService.getCoursesWithProgress(userId);
  }

  // GET /courses/:id - Obtener un curso específico
  @Get(':id')
  async getCourseById(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getCourseById(id);
  }

  // POST /courses/:id/enroll - Inscribirse en un curso
  @Post(':id/enroll')
  async enrollInCourse(
    @Param('id', ParseIntPipe) courseId: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.courseService.enrollUserInCourse(userId, courseId);
  }

  // GET /courses/:id/lessons/:lessonId - Obtener una lección específica
  @Get(':id/lessons/:lessonId')
  async getLesson(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.courseService.getLessonById(lessonId);
  }

  // POST /courses/:id/lessons/:lessonId/complete - Marcar lección como completada
  @Post(':id/lessons/:lessonId/complete')
  async completeLesson(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Request() req,
    @Body() body: { score?: number; timeSpent?: number },
  ) {
    const userId = req.user.userId;
    return this.courseService.completeLessonProgress(
      userId,
      lessonId,
      body.score,
      body.timeSpent,
    );
  }

  // GET /courses/:id/my-progress - Obtener progreso de lecciones del usuario en un curso
  @Get(':id/my-progress')
  async getUserLessonProgress(
    @Param('id', ParseIntPipe) courseId: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.courseService.getUserLessonProgress(userId, courseId);
  }

  // POST /courses - Crear un nuevo curso (solo para administradores)
  @Post()
  async createCourse(
    @Body()
    courseData: {
      title: string;
      description: string;
      category: string;
      difficulty?: string;
      estimatedHours?: number;
      imageUrl?: string;
      order?: number;
    },
  ) {
    return this.courseService.createCourse(courseData);
  }

  // POST /courses/:id/lessons - Crear una nueva lección
  @Post(':id/lessons')
  async createLesson(
    @Param('id', ParseIntPipe) courseId: number,
    @Body()
    lessonData: {
      title: string;
      content: string;
      type?: string;
      difficulty?: string;
      estimatedMinutes?: number;
      order?: number;
      pointsReward?: number;
    },
  ) {
    return this.courseService.createLesson({
      ...lessonData,
      courseId,
    });
  }
}