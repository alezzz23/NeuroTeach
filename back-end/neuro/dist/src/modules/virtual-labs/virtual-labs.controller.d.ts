import { VirtualLabsService, VirtualLab, LabProgress } from './virtual-labs.service';
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
export declare class VirtualLabsController {
    private readonly virtualLabsService;
    constructor(virtualLabsService: VirtualLabsService);
    getAllLabs(category?: string, difficulty?: string): Promise<VirtualLab[]>;
    getLabStatistics(): Promise<any>;
    getLabById(id: number): Promise<VirtualLab>;
    getLabProgress(labId: number, req: any): Promise<LabProgress | null>;
    saveLabProgress(labId: number, progressData: CreateLabProgressDto, req: any): Promise<LabProgress>;
    validateCode(validateData: ValidateCodeDto): Promise<{
        success: boolean;
        errors: string[];
    }>;
    executeCode(executeData: ExecuteCodeDto): Promise<{
        output: string;
        error?: string;
    }>;
    getLabStep(labId: number, stepId: number): Promise<import("./virtual-labs.service").LabStep>;
    completeLab(labId: number, req: any): Promise<{
        message: string;
        completedAt: Date;
    }>;
    getUserProgress(req: any): Promise<{
        userId: any;
        totalLabsStarted: number;
        totalLabsCompleted: number;
        totalTimeSpent: number;
        recentLabs: ({
            labId: number;
            title: string;
            progress: number;
            completedAt: Date;
            lastAccessed?: undefined;
        } | {
            labId: number;
            title: string;
            progress: number;
            lastAccessed: Date;
            completedAt?: undefined;
        })[];
        skillsProgress: {
            python: number;
            html: number;
            css: number;
            javascript: number;
            sql: number;
        };
    }>;
}
