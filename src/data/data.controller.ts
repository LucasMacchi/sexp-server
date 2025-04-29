import { Controller, Post, Body, Patch, Param, Get, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { userGuard } from 'src/user/userAuth.guard';
import types from '../jsons/types.json'
import deparments from "../jsons/department.json"
@Controller('data')
export class DataController {
    constructor(private dataService: DataService) {}

    @Get('tipos')
    async getTypes () {
        return types
    }
    @Get('ubicaciones')
    async getDeparments () {
        return deparments
    }
    @UseGuards(userGuard)
    @Get('services')
    async getServices () {
        return this.dataService.getterData('glpi_sexp_servicio')
    }
    @UseGuards(userGuard)
    @Get('empresas')
    async getEmpresas () {
        return this.dataService.getterData('glpi_sexp_empresa')
    }
    @UseGuards(userGuard)
    @Get('estados')
    async getEstados () {
        return this.dataService.getterData('glpi_sexp_estado')
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
