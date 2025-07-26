import { PrismaService } from '../../prisma/prisma.service';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserById(id: number): Promise<{
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
    } | null>;
    getUserByEmail(email: string): Promise<{
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
    } | null>;
    createUser(data: {
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
    getAllUsers(): Promise<{
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
    }[]>;
}
