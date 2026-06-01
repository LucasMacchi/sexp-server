import { Controller, Post, Body, Patch, Param, Get, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { userGuard } from 'src/user/userAuth.guard';
import types from '../jsons/types.json'
@Controller('data')
export class DataController {
    constructor(private dataService: DataService) {}
    
    @UseGuards(userGuard)
    @Get('tipos')
    async getTypes () {
        return types
    }
    @UseGuards(userGuard)
    @Get('services')
    async getServices () {
        return this.dataService.getterData('glpi_sexp_servicios_1')
    }
    @UseGuards(userGuard)
    @Get('empresas')
    async getEmpresas () {
        return this.dataService.getterData('glpi_sexp_empresa_1')
    }
    @UseGuards(userGuard)
    @Get('clientes')
    async getClientes () {
        return this.dataService.getterData('glpi_sexp_client')
    }
    @UseGuards(userGuard)
    @Get('estados')
    async getEstados () {
        return this.dataService.getterData('glpi_sexp_estado_1')
    }
    @UseGuards(userGuard)
    @Post('service/:service')
    async createService (@Param('service') service: string) {
        return await this.dataService.addService(service)
    }
    @UseGuards(userGuard)
    @Post('empresa/:empresa/:service')
    async createEmpresa (@Param('service') service: string,@Param('empresa') empresa: string) {
        return await this.dataService.addEmpresa(empresa,parseInt(service))
    }
    @UseGuards(userGuard)
    @Post('estado/:estado')
    async createEstado (@Param('estado') estado: string){
        return await this.dataService.addState(estado)
    }
}
