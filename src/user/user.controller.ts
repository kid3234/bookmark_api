/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { Edituserdto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private user: UserService) { }
    // Define your user-related endpoints here
    // For example, you can create methods for user registration, login, etc.

    // Example method
    // @Get('profile')
    // getProfile() {
    //   return 'User profile data';
    // }

    @Get()
    getUser() {
        return this.user.getUsers();
    }
    @Get('profile')
    getProfile(
        @GetUser()
        user: {
            userId: number;
            email: string;
        },
    ) {
        if (!user) {
            throw new Error(
                'User not found in request',
            );
        }
        const userId = user.userId;

        if (!userId) {
            throw new Error(
                'User ID not found in request',
            );
        }
        return this.user.getProfile(userId);
    }

    @Patch('profile')
    editProfile(@GetUser() user: { userId: number }, @Body() dto: Edituserdto) {
        return this.user.editProfile(user.userId, dto)

    }
}
