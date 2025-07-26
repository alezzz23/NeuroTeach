import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Course, Lesson, UserCourseProgress, UserLessonProgress } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los cursos activos
  async getAllCourses(): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            type: true,
            difficulty: true,
            estimatedMinutes: true,
            order: true,
          },
        },
        _count: {
          select: { lessons: true },
        },
      },
    });
  }

  // Obtener un curso específico con sus lecciones
  async getCourseById(courseId: number): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id: courseId, isActive: true },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  // Obtener cursos con progreso del usuario
  async getCoursesWithProgress(userId: number): Promise<any[]> {
    const courses = await this.prisma.course.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        enrollments: {
          where: { userId },
        },
        _count: {
          select: { lessons: true },
        },
      },
    });

    return courses.map(course => ({
      ...course,
      userProgress: course.enrollments[0] || null,
      totalLessons: course._count.lessons,
    }));
  }

  // Inscribir usuario en un curso
  async enrollUserInCourse(userId: number, courseId: number): Promise<UserCourseProgress> {
    return this.prisma.userCourseProgress.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: {},
      create: {
        userId,
        courseId,
      },
    });
  }

  // Obtener una lección específica
  async getLessonById(lessonId: number): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({
      where: { id: lessonId, isActive: true },
      include: {
        course: true,
      },
    });
  }

  // Marcar lección como completada
  async completeLessonProgress(
    userId: number,
    lessonId: number,
    score?: number,
    timeSpent?: number,
  ): Promise<UserLessonProgress> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error('Lección no encontrada');
    }

    // Actualizar progreso de la lección
    const lessonProgress = await this.prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        isCompleted: true,
        score,
        timeSpent,
        completedAt: new Date(),
        attempts: { increment: 1 },
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
        score,
        timeSpent,
        completedAt: new Date(),
        attempts: 1,
      },
    });

    // Actualizar progreso del curso
    await this.updateCourseProgress(userId, lesson.courseId);

    return lessonProgress;
  }

  // Actualizar progreso del curso
  private async updateCourseProgress(userId: number, courseId: number): Promise<void> {
    const totalLessons = await this.prisma.lesson.count({
      where: { courseId, isActive: true },
    });

    const completedLessons = await this.prisma.userLessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: { courseId, isActive: true },
      },
    });

    const progress = totalLessons > 0 ? completedLessons / totalLessons : 0;
    const isCompleted = progress >= 1.0;

    await this.prisma.userCourseProgress.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: {
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId,
        courseId,
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }

  // Obtener progreso de lecciones de un curso para un usuario
  async getUserLessonProgress(userId: number, courseId: number): Promise<any[]> {
    return this.prisma.userLessonProgress.findMany({
      where: {
        userId,
        lesson: { courseId },
      },
      include: {
        lesson: true,
      },
    });
  }

  // Crear un nuevo curso (para administradores)
  async createCourse(courseData: {
    title: string;
    description: string;
    category: string;
    difficulty?: string;
    estimatedHours?: number;
    imageUrl?: string;
    order?: number;
  }): Promise<Course> {
    return this.prisma.course.create({
      data: courseData,
    });
  }

  // Crear una nueva lección
  async createLesson(lessonData: {
    title: string;
    content: string;
    type?: string;
    difficulty?: string;
    estimatedMinutes?: number;
    order?: number;
    pointsReward?: number;
    courseId: number;
  }): Promise<Lesson> {
    return this.prisma.lesson.create({
      data: lessonData,
    });
  }
}