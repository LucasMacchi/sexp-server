import { Body, Controller, Post, Get, Patch, Param, UseGuards,Delete } from '@nestjs/common';
import { ExpedienteService } from './expediente.service';
import expedienteDto from 'src/Dtos/expedienteDto';
import modexpDto from 'src/Dtos/modexpDto';
import { userGuard } from 'src/user/userAuth.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';

@Controller('expediente')
export class ExpedienteController {
    constructor(private expService: ExpedienteService,private httpService:HttpService){}

    @UseGuards(userGuard)
    @Get('all')
    async getExp () {
        return await this.expService.getExpedientes(false)
    }
    @UseGuards(userGuard)
    @Get('all/tracked')
    async getExpTracked () {
        return await this.expService.getExpedientes(true)
    }
    @UseGuards(userGuard)
    @Delete('delete/:id/:user')
    async deleteExp (@Param('id') id: number, @Param('user') user: number) {
        return await this.expService.deleteExpediente(id, user)
    }
    @UseGuards(userGuard)
    @Get("uniq/:id")
    async getUniqExp (@Param('id') id: number) {
        return await this.expService.getUniqExpediente(id)
    }
    @UseGuards(userGuard)
    @Get("historial")
    async getlastHistorial () {
        return await this.expService.getLastHistorial()
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

    @UseGuards(userGuard)
    @Get("salud/:nro")
    async minSaludAPI (@Param("nro") nro: string) {
       return await this.expService.getMinSaludApi(nro,this.httpService)
    }

    @UseGuards(userGuard)
    @Get("cntGral/:nro")
    async contaduriaGralAPI (@Param("nro") nro: string) {
       return await this.expService.getContaduriaGralApi(nro,this.httpService)
    }

    @UseGuards(userGuard)
    @Get("educacion/:nro")
    async minEduAPI (@Param("nro") nro: string) {
       return await this.expService.getMinEduApi(nro,this.httpService)
    }

    @UseGuards(userGuard)
    @Get("chaco/:nro")
    async chacoAPI (@Param("nro") nro: string): Promise<string[]>{
       return await this.expService.getMinChacoAPI(nro,this.httpService)
    }
    
}

