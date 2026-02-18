import { LearnService } from './learn.service';
export declare class LearnController {
    private readonly learnService;
    constructor(learnService: LearnService);
    listTracks(): Promise<{
        id: number;
        slug: string;
        title: string;
        description: string;
        order: number;
    }[]>;
    listTracksWithProgress(req: any): Promise<{
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
    getDashboardSummary(req: any): Promise<{
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
    getTrackBySlug(slug: string): Promise<{
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
    }>;
    getTrackProgress(slug: string, req: any): Promise<{
        trackSlug: string;
        totalExercises: number;
        completedExercises: number;
        completionByExerciseId: Record<number, boolean>;
    }>;
    getExerciseById(id: number): Promise<{
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
    }>;
    getExerciseProgress(id: number, req: any): Promise<{
        updatedAt: Date;
        score: number;
        attempts: number;
        code: string;
        isCompleted: boolean;
        completedAt: Date | null;
    } | null>;
    saveExerciseProgress(id: number, body: {
        code?: string;
        isCompleted?: boolean;
        score?: number;
    }, req: any): Promise<{
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
    runExercise(id: number, body: {
        code?: string;
        submission?: unknown;
    }): Promise<import("./learn.runtime").RunResult>;
    validateExercise(id: number, body: {
        code?: string;
        submission?: unknown;
    }): Promise<import("./learn.runtime").ValidateResult>;
}
