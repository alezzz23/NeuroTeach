import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(name: string, email: string, password: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        role: string;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
