import { UserService } from '../user/user.service';
export declare class AuthService {
    private readonly userService;
    constructor(userService: UserService);
    register(name: string, email: string, password: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string | null;
    }>;
    login(email: string, password: string): Promise<{
        id: number;
        name: string;
        email: string;
    }>;
}
