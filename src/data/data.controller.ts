import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
    constructor(private dataService: DataService) {}

    @Post('service/:service')
    async createService (@Param('service') service: string) {
        return await this.dataService.addService(service)
    }

    @Post('empresa/:empresa/:service')
    async createEmpresa (@Param('service') service: string,@Param('empresa') empresa: string) {
        return await this.dataService.addEmpresa(empresa,parseInt(service))
    }

    @Post('estado/:estado')
    async createEstado (@Param('estado') estado: string){
        return await this.dataService.addState(estado)
    }
}
