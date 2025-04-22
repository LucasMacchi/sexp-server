import { Body, Controller, Post, Get, Patch, Param } from '@nestjs/common';
import { ExpedienteService } from './expediente.service';
import expedienteDto from 'src/Dtos/expedienteDto';
import modexpDto from 'src/Dtos/modexpDto';

@Controller('expediente')
export class ExpedienteController {
    constructor(private expService: ExpedienteService){}

    @Get('all')
    async getExp () {
        return await this.expService.getExpedientes()
    }

    @Post('add')
    async createExp (@Body() exp: expedienteDto) {
        return await this.expService.createExpediente(exp)
    }

    @Patch('edit/:id')
    async editExp (@Param('id') id: number,
    @Body() data: modexpDto) {
        return await this.expService.editExpediente(id, data)
    }
}
