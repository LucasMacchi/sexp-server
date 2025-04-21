import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import loginDto from 'src/Dtos/loginDto';
import registerDto from 'src/Dtos/registerDto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('login')
    async loginUser (@Body() body: loginDto) {
        return await this.userService.login(body)
    }
    @Post('register')
    async registerUser (@Body() body: registerDto) {
        return await this.userService.register(body)
    }
    @Patch('activate/:user')
    async activateUser (@Param('user') user: number) {
        return await this.userService.activateU(user)
    }
    @Patch('deactivate/:user')
    async deactivateUser (@Param('user') user: number) {
        return await this.userService.deactivateU(user)
    }
}
