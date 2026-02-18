import { PrismaService } from '../../prisma/prisma.service';
export declare class LearnService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listTracks(): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        order: number;
    }[]>;
    listTracksWithProgress(userId: number): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        order: number;
        progress: {
            totalExercises: number;
            completedExercises: number;
            percent: number;
        };
    }[]>;
    getTrackBySlug(slug: string): Promise<({
        modules: ({
            exercises: {
                id: number;
                slug: string;
                title: string;
                description: string;
                order: number;
                type: string;
                language: string;
                points: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            order: number;
            trackId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        description: string;
        isPublished: boolean;
        order: number;
    }) | null>;
    getExerciseById(exerciseId: number): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        module: {
            id: number;
            track: {
                slug: string;
                title: string;
            };
            title: string;
        };
        instructions: import("@prisma/client/runtime/library").JsonValue;
        starterCode: string;
        type: string;
        language: string;
        validation: import("@prisma/client/runtime/library").JsonValue;
        points: number;
    } | null>;
    getExerciseProgress(userId: number, exerciseId: number): Promise<{
        updatedAt: Date;
        score: number;
        attempts: number;
        code: string;
        isCompleted: boolean;
        completedAt: Date | null;
    } | null>;
    saveExerciseProgress(userId: number, exerciseId: number, data: {
        code?: string;
        isCompleted?: boolean;
        score?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        score: number;
        attempts: number;
        exerciseId: number;
        code: string;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    getTrackProgress(userId: number, trackSlug: string): Promise<{
        trackSlug: string;
        totalExercises: number;
        completedExercises: number;
        completionByExerciseId: Record<number, boolean>;
    } | null>;
    getDashboardLearningSummary(userId: number): Promise<{
        nextExercise: {
            id: number;
            title: string;
            trackSlug: string;
            trackTitle: string;
        } | null;
        tracksInProgress: {
            id: number;
            slug: string;
            title: string;
            description: string;
            order: number;
            progress: {
                totalExercises: number;
                completedExercises: number;
                percent: number;
            };
        }[];
        metrics: {
            completedThisWeek: number;
            avgAttemptsCompleted: number;
            exerciseStreakDays: number;
        };
    }>;
}
