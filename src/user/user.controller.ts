import { Controller, Post, Body, Patch, Param, Get, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import loginDto from 'src/Dtos/loginDto';
import registerDto from 'src/Dtos/registerDto';
import { userGuard } from './userAuth.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @UseGuards(userGuard)
    @Get('all')
    async getAllUsers () {
        return await this.userService.getAll()
    }
    @Post('login')
    async loginUser (@Body() body: loginDto) {
        return await this.userService.login(body)
    }
    @UseGuards(userGuard)
    @Post('register')
    async registerUser (@Body() body: registerDto) {
        return await this.userService.register(body)
    }
    @UseGuards(userGuard)
    @Patch('activate/:user')
    async activateUser (@Param('user') user: number) {
        return await this.userService.activateU(user)
    }
    @UseGuards(userGuard)
    @Patch('deactivate/:user')
    async deactivateUser (@Param('user') user: number) {
        return await this.userService.deactivateU(user)
    }
    @UseGuards(userGuard)
    @Post('credential/:user/:empresa')
    async addCredentials (@Param('user') user: number, @Param('empresa') empresa: number) {
        return await this.userService.addCredential(user, empresa)
    }
    @UseGuards(userGuard)
    @Delete('credential/:id')
    async delCredentials (@Param('id') id: number) {
        return this.userService.deleteCredential(id)
    }
}
