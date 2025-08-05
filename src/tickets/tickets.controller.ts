import { Body, Controller, Post, Get } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import addTicketDto from 'src/Dtos/addTicketDto';

@Controller('tickets')
export class TicketsController {
    constructor(private tckService: TicketsService){}
    
    @Post('add')
    async addTicket (@Body() tck: addTicketDto) {
        return await this.tckService.addTicket(tck)
    }

    @Get('prov/all')
    async getAllProv () {
        return await this.tckService.getProveedores()
    }

    @Get('conc/all')
    async getAllConc () {
        return this.tckService.getConceptos()
    }

    @Get('txt')
    async getTxt () {
        return this.tckService.createTxt()
    }
}
