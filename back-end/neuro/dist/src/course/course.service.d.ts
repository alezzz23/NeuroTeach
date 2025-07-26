import { PrismaService } from '../prisma/prisma.service';
import { Course, Lesson, UserCourseProgress, UserLessonProgress } from '@prisma/client';
export declare class CourseService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllCourses(): Promise<Course[]>;
    getCourseById(courseId: number): Promise<Course | null>;
    getCoursesWithProgress(userId: number): Promise<any[]>;
    enrollUserInCourse(userId: number, courseId: number): Promise<UserCourseProgress>;
    getLessonById(lessonId: number): Promise<Lesson | null>;
    completeLessonProgress(userId: number, lessonId: number, score?: number, timeSpent?: number): Promise<UserLessonProgress>;
    private updateCourseProgress;
    getUserLessonProgress(userId: number, courseId: number): Promise<any[]>;
    createCourse(courseData: {
        title: string;
        description: string;
        category: string;
        difficulty?: string;
        estimatedHours?: number;
        imageUrl?: string;
        order?: number;
    }): Promise<Course>;
    createLesson(lessonData: {
        title: string;
        content: string;
        type?: string;
        difficulty?: string;
        estimatedMinutes?: number;
        order?: number;
        pointsReward?: number;
        courseId: number;
    }): Promise<Lesson>;
}
