import { PrismaService } from '../../prisma/prisma.service';
export interface VirtualLab {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: string;
    technologies: string[];
    objectives: string[];
    status: 'available' | 'coming-soon' | 'maintenance';
    completedBy: number;
    rating: number;
    steps: LabStep[];
    createdAt: Date;
    updatedAt: Date;
}
export interface LabStep {
    id: number;
    title: string;
    description: string;
    instructions: string[];
    initialCode: string;
    expectedOutput: string;
    hints: string[];
    validation: {
        type: string;
        checks: ValidationCheck[];
    };
    order: number;
}
export interface ValidationCheck {
    type: 'variable_exists' | 'function_called' | 'function_defined' | 'keyword_used' | 'method_called';
    name: string;
}
export interface LabProgress {
    userId: number;
    labId: number;
    currentStep: number;
    completedSteps: number[];
    code: string;
    startedAt: Date;
    completedAt?: Date;
    timeSpent: number;
}
export declare class VirtualLabsService {
    private prisma;
    constructor(prisma: PrismaService);
    private mockLabs;
    getAllLabs(): Promise<VirtualLab[]>;
    getLabById(id: number): Promise<VirtualLab | null>;
    getLabsByCategory(category: string): Promise<VirtualLab[]>;
    getLabsByDifficulty(difficulty: string): Promise<VirtualLab[]>;
    getUserLabProgress(userId: number, labId: number): Promise<LabProgress | null>;
    saveLabProgress(progress: Partial<LabProgress>): Promise<LabProgress>;
    validateCode(code: string, validation: any): Promise<{
        success: boolean;
        errors: string[];
    }>;
    executeCode(code: string, language: string): Promise<{
        output: string;
        error?: string;
    }>;
    getLabStatistics(): Promise<any>;
}
