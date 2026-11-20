import { Body, Controller, Post, Get, Patch, Param, UseGuards,Delete } from '@nestjs/common';
import { ExpedienteService } from './expediente.service';
import expedienteDto from 'src/Dtos/expedienteDto';
import modexpDto from 'src/Dtos/modexpDto';
import { userGuard } from 'src/user/userAuth.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';
import updaterGral from 'src/Dtos/updaterGral';


const secret = process.env.UPDATER_KEY ?? undefined

@Controller('expediente')
export class ExpedienteController {
    constructor(private expService: ExpedienteService,private httpService:HttpService){}

    /** Retorna todos los expedientes activos (no eliminados). */
    @UseGuards(userGuard)
    @Get('all')
    async getExp () {
        return await this.expService.getExpedientes(false)
    }

    /** Retorna únicamente los expedientes marcados para seguimiento. */
    @UseGuards(userGuard)
    @Get('all/tracked')
    async getExpTracked () {
        return await this.expService.getExpedientes(true)
    }

    /** Realiza el borrado lógico de un expediente y registra el log del usuario. */
    @UseGuards(userGuard)
    @Delete('delete/:id/:user')
    async deleteExp (@Param('id') id: number, @Param('user') user: number) {
        return await this.expService.deleteExpediente(id, user)
    }

    /** Obtiene el detalle de un expediente por su ID junto a su historial de cambios. */
    @UseGuards(userGuard)
    @Get("uniq/:id")
    async getUniqExp (@Param('id') id: number) {
        return await this.expService.getUniqExpediente(id)
    }

    /** Obtiene los últimos 100 movimientos de auditoría registrados en expedientes. */
    @UseGuards(userGuard)
    @Get("historial")
    async getlastHistorial () {
        return await this.expService.getLastHistorial()
    }

    /** Busca y devuelve el ID de un expediente a partir de su número oficial. */
    @UseGuards(userGuard)
    @Get("number/:nro")
    async getUniqExpNro (@Param('nro') nro: string) {
        return await this.expService.getByNro(nro)
    }

    /** Crea un nuevo expediente en la base de datos y genera sus logs iniciales. */
    @UseGuards(userGuard)
    @Post('add')
    async createExp (@Body() exp: expedienteDto) {
        return await this.expService.createExpediente(exp)
    }

    /** Modifica una propiedad del expediente y registra el cambio en el historial. */
    @UseGuards(userGuard)
    @Patch('edit/:id')
    async editExp (@Param('id') id: number, @Body() data: modexpDto) {
      return await this.expService.editExpediente(id, data)
    }

    /** Consulta la ubicación del expediente en el portal del Ministerio de Salud de Corrientes. */
    @UseGuards(userGuard)
    @Get("salud/:nro")
    async minSaludAPI (@Param("nro") nro: string) {
       return await this.expService.getMinSaludApi(nro,this.httpService)
    }

    /** Consulta la información del expediente en la API de Contaduría General de Corrientes. */
    //@UseGuards(userGuard)
    @Get("cntGral/:nro")
    async contaduriaGralAPI (@Param("nro") nro: string) {
       return await this.expService.getContaduriaGralApi(nro,this.httpService)
    }

    /** Realiza web scraping en el portal del Ministerio de Educación de Corrientes para ubicar el expediente. */
    @UseGuards(userGuard)
    @Get("educacion/:nro")
    async minEduAPI (@Param("nro") nro: string) {
       return await this.expService.getMinEduApi(nro,this.httpService)
    }

    /** Consulta mediante web scraping los últimos movimientos de un expediente en el portal de Trámites del Chaco. */
    @UseGuards(userGuard)
    @Get("chaco/:nro")
    async chacoAPI (@Param("nro") nro: string): Promise<string[]>{
       return await this.expService.getMinChacoAPI(nro,this.httpService)
    }

    /** Ejecuta la sincronización masiva de expedientes con los portales externos mediante clave de acceso. */
    @Post("masivo/updater/:key")
    async massiveUpdater (@Param("key") key: string,@Body() gral: updaterGral[]): Promise<string[]>{
        if(secret && secret === key) return this.expService.massiveUpdate(this.httpService,gral)
        else return ["INVALID KEY"]
    }
    
    /** Obtiene los números de expedientes activos a ser procesados por el sincronizador masivo. */
    @Get('all/updater/:key')
    async allExpUpdater (@Param("key") key: string) {
        if(secret && secret === key) return this.expService.getAllExpedientesForUpdate()
        else return ["INVALID KEY"]
    }
}

