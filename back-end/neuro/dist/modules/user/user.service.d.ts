import { PrismaService } from '../../prisma/prisma.service';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserById(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        password: string | null;
    } | null>;
    getUserByEmail(email: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string | null;
    } | null>;
    createUser(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        password: string | null;
    }>;
    getAllUsers(): Promise<{
        id: number;
        name: string;
        email: string;
        password: string | null;
    }[]>;
}
