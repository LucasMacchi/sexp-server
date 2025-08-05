import { Body, Controller, Post, Get } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import addTicketDto from 'src/Dtos/addTicketDto';
import txtdataDto from 'src/Dtos/txtdataDto';

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

    @Post('txt')
    async getTxt (@Body() data: txtdataDto) {
        return this.tckService.createTxt(data)
    }

    @Get('latest')
    async getLatestTickets () {
        return this.tckService.getTickets()
    }
}
