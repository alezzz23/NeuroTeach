import { PrismaService } from '../../prisma/prisma.service';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserById(id: number): Promise<{
        id: number;
        name: string;
        email: string;
    } | null>;
    createUser(data: {
        name: string;
        email: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
    }>;
    getAllUsers(): Promise<{
        id: number;
        name: string;
        email: string;
    }[]>;
}
