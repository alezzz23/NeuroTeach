import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(id: string): Promise<{
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
    } | {
        error: string;
    }>;
}
