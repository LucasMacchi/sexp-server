import { Body, Controller, Post } from '@nestjs/common';
import { ExpedienteService } from './expediente.service';
import expedienteDto from 'src/Dtos/expedienteDto';

@Controller('expediente')
export class ExpedienteController {
    constructor(private expService: ExpedienteService){}

    @Post('add')
    async createExp (@Body() exp: expedienteDto) {
        return await this.expService.createExpediente(exp)
    }
}
