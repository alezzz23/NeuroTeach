import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(name: string, email: string, password: string): Promise<{
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
    login(email: string, password: string): Promise<{
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
