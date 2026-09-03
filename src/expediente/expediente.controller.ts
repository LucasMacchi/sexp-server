import { Body, Controller, Post, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ExpedienteService } from './expediente.service';
import expedienteDto from 'src/Dtos/expedienteDto';
import modexpDto from 'src/Dtos/modexpDto';
import { userGuard } from 'src/user/userAuth.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';
import { decode } from 'html-entities';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import extraer from 'src/utils/extraerEdu';
import { parse } from 'path';

interface MovimientoTramite {
    fecha: string;
    hora: string;
    origen: string;
    situacionDestino: string;
}

@Controller('expediente')
export class ExpedienteController {
    constructor(private expService: ExpedienteService,private httpService:HttpService){}

    @UseGuards(userGuard)
    @Get('all')
    async getExp () {
        return await this.expService.getExpedientes()
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
        const e = nro.slice(0,3)
        const n = nro.slice(3,8)
        const f = nro.slice(8)
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        const url = `https://saludcorrientes.gob.ar/w/wp-content/themes/salud/js/request.php?e=${e}&n=${n}&f=${f}&format=jsonp`
        const {data} = await firstValueFrom(this.httpService.get(url,{httpsAgent}))
        console.log(data)
        return decode(data["contenido"]["ubicacion"])
    }

    @UseGuards(userGuard)
    @Get("cntGral/:nro")
    async contaduriaGralAPI (@Param("nro") nro: string) {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        const url = `https://nportal.cgpc.gob.ar/documentos/apiweb/Consultas-Web/consulta?expediente=%27${nro}%27`
        const {data} = await firstValueFrom(this.httpService.get(url,{httpsAgent}))
        console.log(data)
        return data
    }

    @UseGuards(userGuard)
    @Get("educacion/:nro")
    async minEduAPI (@Param("nro") nro: string) {
        const repartic = nro.slice(0,3)
        const otros = nro.slice(3,8)
        const anio = nro.slice(8)
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        const form = new URLSearchParams()
        form.append("tr","E")
        form.append("repartic",repartic)
        form.append("otros",otros)
        form.append("anio",anio)
        form.append('asunto', '');
        form.append('ver', 'true');
        form.append('aa', '');
        const url = "https://expgob.mec.gob.ar/lup_mod/ubicar_expedWeb.asp"
        const {data} = await firstValueFrom(this.httpService.post(url,form.toString(),{
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            responseType: 'arraybuffer',
            httpsAgent
        }))
        const html = iconv.decode(Buffer.from(data), 'iso-8859-1');
        const $ = cheerio.load(html);
        const textoCompleto = $('body').text();
        if(textoCompleto.length < 10) return "Error al traer datos del ministerio."
        const parsed = {
            data: {
                numero: extraer(/Nro:\s*([^\n\r]+)/,textoCompleto),
                iniciador: extraer(/Iniciador:\s*([^\n\r]+)/,textoCompleto),
                extracto: extraer(/Extracto:\s*([^\n\r]+)/,textoCompleto),
                oficina: extraer(/Oficina:\s*(.*?)(?=\.\s*Repartición:|$)/,textoCompleto),
                reparticion: extraer(/Repartición:\s*([^\n\r]+)/,textoCompleto),
                desde: extraer(/Desde:\s*([^\n\r]+)/,textoCompleto),
            }
        }
        const response = `NUMERO: ${parsed.data.numero} - EXTRACTO: ${parsed.data.extracto} - OFICINA: ${parsed.data.oficina} - REPARTICION: ${parsed.data.reparticion} - DESDE: ${parsed.data.desde}`
        return response
    }

    //@UseGuards(userGuard)
    @Get("chaco/:nro")
    async chacoAPI (@Param("nro") nro: string): Promise<string[]>{
        const dividedNro = nro.split("-")
        const jurisdiccionid = dividedNro[0];
        const anio = dividedNro[1];
        const numero = dividedNro[2];
        const tipotramite = dividedNro[3];
        const url = "https://consultatramites.chaco.gob.ar/"
        const params = new URLSearchParams({
            'form[jurisdiccionid]': jurisdiccionid,
            'form[anio]': anio,
            'form[numero]': numero,
            'form[tipotramite]':tipotramite,
            'form[save]': '',
        });
        
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        const {data} = await firstValueFrom(this.httpService.post(url,params.toString(),{
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            httpsAgent
        }))

        const $ = cheerio.load(data);
        const movimientos: MovimientoTramite[] = [];
        $('#no-more-tables tbody tr').each((_, row) => {
            const celdas = $(row)
                .find('td')
                .map((_, td) => $(td).text().trim())
                .get();

            if (celdas.length >= 4) {
                movimientos.push({
                fecha: celdas[0],
                hora: celdas[1],
                origen: celdas[2],
                situacionDestino: celdas[3],
                });
            }
        });
        let movs:string[] = []
        movimientos.forEach((m,i) => {
            if(i === 0) movs.push(`${m.fecha} ${m.hora} - ${m.origen} - ${m.situacionDestino}`) 
            if(i < 5 && i > 0) movs.push(`${m.fecha} ${m.hora} - ${m.origen} - ${m.situacionDestino}`)
        });
        return movs
    }
    
}

