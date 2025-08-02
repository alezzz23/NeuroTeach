import { AdaptationService, AdaptationRequest, AdaptationResponse } from './adaptation.service';
export declare class AdaptationController {
    private readonly adaptationService;
    constructor(adaptationService: AdaptationService);
    getNextStep(data: AdaptationRequest): AdaptationResponse;
}
