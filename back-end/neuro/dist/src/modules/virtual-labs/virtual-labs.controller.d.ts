export interface CreateLabProgressDto {
    labId: number;
    currentStep: number;
    completedSteps: number[];
    code: string;
    timeSpent: number;
    isCompleted?: boolean;
    score?: number;
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
