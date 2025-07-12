import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(id: string): Promise<{
        id: number;
        name: string;
        email: string;
    } | {
        error: string;
    }>;
    createUser(data: {
        name: string;
        email: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
    }>;
}
