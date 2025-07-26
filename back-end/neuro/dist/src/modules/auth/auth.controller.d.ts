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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        password: string;
        role: string;
        totalPoints: number;
        level: number;
        currentStreak: number;
        longestStreak: number;
        lastSessionDate: Date | null;
        achievements: import("@prisma/client/runtime/library").JsonValue;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            role: string;
            totalPoints: number;
            level: number;
            currentStreak: number;
            longestStreak: number;
            lastSessionDate: Date | null;
            achievements: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
}
