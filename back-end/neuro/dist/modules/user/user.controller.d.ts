import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(id: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: string;
    } | {
        error: string;
    }>;
}
