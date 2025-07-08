import { Body, Controller, Post, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ExpedienteService } from './expediente.service';
import expedienteDto from 'src/Dtos/expedienteDto';
import modexpDto from 'src/Dtos/modexpDto';
import { userGuard } from 'src/user/userAuth.guard';

@Controller('expediente')
export class ExpedienteController {
    constructor(private expService: ExpedienteService){}

    @UseGuards(userGuard)
    @Get('all')
    async getExp () {
        return await this.expService.getExpedientes()
    }
    @UseGuards(userGuard)
    @Get("uniq/:id")
    async getUniqExp (@Param('id') id: number) {
        return await this.expService.getUniqExpediente(id)
    }
    @UseGuards(userGuard)
    @Get("number/:nro")
    async getUniqExpNro (@Param('nro') nro: string) {
        return await this.expService.getByNro(nro)
    }
    @UseGuards(userGuard)
    @Post('add')
    async createExp (@Body() exp: expedienteDto) {
        return await this.expService.createExpediente(exp)
    }
    @UseGuards(userGuard)
    @Patch('edit/:id')
    async editExp (@Param('id') id: number, @Body() data: modexpDto) {
      return await this.expService.editExpediente(id, data)
    }
}
