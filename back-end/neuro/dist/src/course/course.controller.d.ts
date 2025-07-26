import { CourseService } from './course.service';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    getAllCourses(): Promise<{
        id: number;
        title: string;
        description: string;
        category: string;
        difficulty: string;
        estimatedHours: number;
        imageUrl: string | null;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getMyCoursesProgress(req: any): Promise<any[]>;
    getCourseById(id: number): Promise<{
        id: number;
        title: string;
        description: string;
        category: string;
        difficulty: string;
        estimatedHours: number;
        imageUrl: string | null;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    enrollInCourse(courseId: number, req: any): Promise<{
        id: number;
        userId: number;
        courseId: number;
        progress: number;
        isCompleted: boolean;
        startedAt: Date;
        completedAt: Date | null;
    }>;
    getLesson(lessonId: number): Promise<{
        id: number;
        title: string;
        difficulty: string;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        interactiveContent: import("@prisma/client/runtime/library").JsonValue | null;
        courseId: number;
        content: string;
        estimatedMinutes: number;
        pointsReward: number;
    } | null>;
    completeLesson(lessonId: number, req: any, body: {
        score?: number;
        timeSpent?: number;
    }): Promise<{
        id: number;
        score: number | null;
        userId: number;
        lessonId: number;
        isCompleted: boolean;
        startedAt: Date;
        completedAt: Date | null;
        timeSpent: number | null;
        attempts: number;
    }>;
    getUserLessonProgress(courseId: number, req: any): Promise<any[]>;
    createCourse(courseData: {
        title: string;
        description: string;
        category: string;
        difficulty?: string;
        estimatedHours?: number;
        imageUrl?: string;
        order?: number;
    }): Promise<{
        id: number;
        title: string;
        description: string;
        category: string;
        difficulty: string;
        estimatedHours: number;
        imageUrl: string | null;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createLesson(courseId: number, lessonData: {
        title: string;
        content: string;
        type?: string;
        difficulty?: string;
        estimatedMinutes?: number;
        order?: number;
        pointsReward?: number;
    }): Promise<{
        id: number;
        title: string;
        difficulty: string;
        isActive: boolean;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        interactiveContent: import("@prisma/client/runtime/library").JsonValue | null;
        courseId: number;
        content: string;
        estimatedMinutes: number;
        pointsReward: number;
    }>;
}
