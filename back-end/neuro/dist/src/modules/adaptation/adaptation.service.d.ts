export interface AdaptationRequest {
    emotion: string;
    performance: number;
    context?: string;
    learningStyle?: string;
    timeSpent?: number;
    attempts?: number;
}
export interface AdaptationResponse {
    action: string;
    message: string;
    difficulty: 'muy_facil' | 'facil' | 'normal' | 'dificil' | 'muy_dificil';
    strategy: string;
    resources: string[];
    estimatedTime: number;
    confidence: number;
}
export declare class AdaptationService {
    private readonly emotionWeights;
    private readonly learningStrategies;
    recommendNextStep(data: AdaptationRequest): AdaptationResponse;
    private calculateDifficulty;
    private selectStrategy;
    private getRecommendedResources;
    private calculateEstimatedTime;
    private calculateConfidence;
    private generateActionAndMessage;
}
