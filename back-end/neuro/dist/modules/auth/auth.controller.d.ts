import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        password: string | null;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
    }>;
}
