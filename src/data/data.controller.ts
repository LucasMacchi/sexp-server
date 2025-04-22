import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
    constructor(private dataService: DataService) {}

    @Get('services')
    async getServices () {
        return this.dataService.getterData('glpi_sexp_servicio')
    }
    @Get('empresas')
    async getEmpresas () {
        return this.dataService.getterData('glpi_sexp_empresa')
    }
    @Get('estados')
    async getEstados () {
        return this.dataService.getterData('glpi_sexp_estado')
    }
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
