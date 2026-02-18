export type RunResult = {
    output: string;
    error?: string;
};
export type ValidateResult = {
    ok?: boolean;
    success: boolean;
    errors: string[];
    output?: string;
    details?: any;
    score?: number;
};
type ExerciseLike = {
    type?: string;
    language?: string;
};
export declare function runCodeMvp(code: string, language: string, submission?: unknown, exercise?: ExerciseLike): Promise<RunResult>;
export declare function validateCodeMvp(code: string, validation: unknown, submission?: unknown, exercise?: ExerciseLike): Promise<ValidateResult>;
export {};
