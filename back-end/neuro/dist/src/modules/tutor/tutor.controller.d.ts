import { TutorService } from './tutor.service';
export declare class TutorController {
    private readonly tutorService;
    constructor(tutorService: TutorService);
    askTutor(prompt: string, emotion: string): Promise<any>;
}
