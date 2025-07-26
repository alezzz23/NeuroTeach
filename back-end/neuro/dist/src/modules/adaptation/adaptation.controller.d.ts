import { AdaptationService } from './adaptation.service';
export declare class AdaptationController {
    private readonly adaptationService;
    constructor(adaptationService: AdaptationService);
    getNextStep(data: any): {
        action: string;
        message: string;
    };
}
