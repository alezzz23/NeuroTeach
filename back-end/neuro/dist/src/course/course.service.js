"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CourseService = class CourseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllCourses() {
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
    async getCourseById(courseId) {
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
    async getCoursesWithProgress(userId) {
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
    async enrollUserInCourse(userId, courseId) {
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
    async getLessonById(lessonId) {
        return this.prisma.lesson.findUnique({
            where: { id: lessonId, isActive: true },
            include: {
                course: true,
            },
        });
    }
    async completeLessonProgress(userId, lessonId, score, timeSpent) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!lesson) {
            throw new Error('Lección no encontrada');
        }
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
        await this.updateCourseProgress(userId, lesson.courseId);
        return lessonProgress;
    }
    async updateCourseProgress(userId, courseId) {
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
    async getUserLessonProgress(userId, courseId) {
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
    async createCourse(courseData) {
        return this.prisma.course.create({
            data: courseData,
        });
    }
    async createLesson(lessonData) {
        return this.prisma.lesson.create({
            data: lessonData,
        });
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CourseService);
//# sourceMappingURL=course.service.js.map