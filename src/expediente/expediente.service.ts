import { Injectable } from '@nestjs/common';
import expedienteDto from 'src/Dtos/expedienteDto';
import modexpDto from 'src/Dtos/modexpDto';
import clientReturner from 'src/utils/clientReturner';
import * as https from 'https';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { decode } from 'node_modules/html-entities/dist/commonjs';
import * as iconv from 'iconv-lite';
import extraer from 'src/utils/extraerEdu';
import * as cheerio from 'cheerio';

@Injectable()
export class ExpedienteService {

    async editExpediente (id: number, data: modexpDto) {
        const conn = clientReturner()
        await conn.connect()
        console.log(data)
        let isFacturado = false
        if(data.prop === "estado_id") {
            const sqlGetEst = `SELECT e.estado_id FROM public.glpi_sexp_expediente e  WHERE e.exp_id = ${id};`
            const newConcepto = (await conn.query(`SELECT concepto FROM public.glpi_sexp_estado_1 WHERE estado_id = ${data.value};`)).rows[0]["concepto"]
            const prev_estado:number = (await conn.query(sqlGetEst)).rows[0]["estado_id"]
            if(newConcepto === 'Facturado pagado') {
                isFacturado = true
            }
            const lastLog = `SELECT MAX(fecha) FROM public.glpi_sexp_estados_log WHERE exp_id = $1`
            const fecha:string = (await conn.query(lastLog,[id])).rows[0]["max"]
            const sqlLogEstado = `INSERT INTO public.glpi_sexp_estados_log(fecha, prev, post, exp_id,fecha_prev) VALUES (NOW(), $1, $2, $3, $4);`
            await conn.query(sqlLogEstado, [prev_estado, data.value, id, fecha])

        }
        if(data.prop !== "seguimiento") {
            const log = `INSERT INTO public.glpi_sexp_expediente_log(exp_id, col, des,user_id,prev) VALUES ($1, $2, $3, $4,(SELECT ${data.prop} FROM public.glpi_sexp_expediente WHERE exp_id = ${id}));`
            const importeLog = 'SELECT importe_2 FROM public.glpi_sexp_expediente WHERE exp_id = $1;'
           if(isFacturado) {
                const prevImporte = await (await conn.query(importeLog,[id])).rows[0]["importe_2"]
                await conn.query(log,[id,"importe_2",prevImporte,data.userId])
            }
            const sql = isFacturado ? `UPDATE public.glpi_sexp_expediente SET ${data.prop}=$1,importe_2 = importe, last_mod=NOW(), fecha_ult_mod=NOW()  WHERE exp_id = $2;` : 
            `UPDATE public.glpi_sexp_expediente SET ${data.prop}=$1, last_mod=NOW(), fecha_ult_mod=NOW()  WHERE exp_id = $2;`
            data.prop !== "api1" && data.prop !== "api2" ? await conn.query(log,[id,data.prop,data.value,data.userId]) : null
            await conn.query(sql,[data.value,id])
        }
        else {
            const log = `INSERT INTO public.glpi_sexp_expediente_log(exp_id, col, des,user_id) VALUES ($1, $2, $3, $4);`
            await conn.query(log,[id,data.prop.toUpperCase(),data.value,data.userId])
        }

        await conn.end()
        return `Expediente actualizado.`
    }
    async getExpedientes (track:boolean) {
        const sql = track ? `SELECT * FROM public.glpi_sexp_expediente WHERE deleted = false AND track = true ORDER BY fecha_presentacion DESC;` : `SELECT * FROM public.glpi_sexp_expediente WHERE deleted = false ORDER BY fecha_presentacion DESC;`
        const conn = clientReturner()
        await conn.connect()
        const exps = (await conn.query(sql)).rows
        await conn.end()
        return exps
    }
    async deleteExpediente (id: number,user: number) {
        const sql = 'UPDATE public.glpi_sexp_expediente SET deleted = true WHERE exp_id = $1;'
        const log = `INSERT INTO public.glpi_sexp_expediente_log(exp_id, col, des,user_id) VALUES ($1, $2, $3, $4);`
        const conn = clientReturner()
        await conn.connect()
        await conn.query(sql,[id])
        await conn.query(log,[id,"Eliminado","Expediente eliminado",user])
        await conn.end()
        return `Expediente eliminado.`
    }
    async createExpediente (exp: expedienteDto){
        const sql = `INSERT INTO public.glpi_sexp_expediente
        (service_id, user_id, numero_exp, concepto, periodo, 
        fecha_presentacion, fecha_ult_mod, nro_factura, 
        empresa_id, estado_id, importe, descripcion, tipo, ocultado,importe_2,client_id)
        VALUES(${exp.servicio_id},${exp.user_id} , '${exp.numero_exp}', 
        '${exp.concepto}', '${exp.periodo}', '${exp.fecha_presentacion}', 
        '${exp.fecha_presentacion}', '${exp.nro_factura}', ${exp.empresa_id},
         ${exp.estado_id}, ${exp.importe}, '${exp.descripcion}'
         , '${exp.tipo}', ${exp.ocultado}, 0, ${exp.client_id});`
        
        const conn = clientReturner()
        await conn.connect()
        await conn.query(sql)
        await conn.end()
    }
    async getUniqExpediente (id: number) {
        const sql = `SELECT * FROM public.glpi_sexp_expediente WHERE exp_id = ${id};`
        const sqlHis = `SELECT l.*,u.first_name,u.last_name FROM public.glpi_sexp_expediente_log l 
        JOIN public.glpi_sexp_users u ON u.user_id = l.user_id WHERE l.exp_id = $1 ORDER BY l.fecha DESC;`
        const conn = clientReturner()
        await conn.connect()
        const exps = (await conn.query(sql)).rows[0]
        exps.historial = (await conn.query(sqlHis,[id])).rows
        const sqlLastSaw = `UPDATE public.glpi_sexp_expediente SET last_saw=NOW() WHERE exp_id = ${id};`
        await conn.query(sqlLastSaw)
        await conn.end()
        return exps
    }

    async getLastHistorial () {
        const sql = `SELECT l.*,e.numero_exp,e.concepto,u.first_name,u.last_name FROM public.glpi_sexp_expediente_log l 
        JOIN public.glpi_sexp_expediente e ON e.exp_id = l.exp_id
        JOIN public.glpi_sexp_users u ON u.user_id = l.user_id 
        ORDER BY l.log_id DESC LIMIT 100;`
        const conn = clientReturner()
        await conn.connect()
        const exps = (await conn.query(sql)).rows
        await conn.end()
        return exps
    }

    async getByNro (nro: string) {
        const sql = `SELECT exp_id FROM public.glpi_sexp_expediente WHERE numero_exp = '${nro}' AND deleted = false;`
        const conn = clientReturner()
        await conn.connect()
        const exps = (await conn.query(sql)).rows[0]
        console.log(exps)
        await conn.end()
        return exps
    }

    async getMinSaludApi (nro: string,httpService:HttpService) {
        const e = nro.slice(0,3)
        const n = nro.slice(3,8)
        const f = nro.slice(8)
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        const url = `https://saludcorrientes.gob.ar/w/wp-content/themes/salud/js/request.php?e=${e}&n=${n}&f=${f}&format=jsonp`
        const {data} = await firstValueFrom(httpService.get(url,{httpsAgent}))
        console.log(data)
        return decode(data["contenido"]["ubicacion"])
    }

    async getMinEduApi (nro: string,httpService:HttpService) {
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
        const {data} = await firstValueFrom(httpService.post(url,form.toString(),{
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
        let response = "Error al traer datos del ministerio."
        if(parsed.data.numero && parsed.data.iniciador && parsed.data.extracto && parsed.data.oficina && parsed.data.reparticion && parsed.data.desde) {
            response = `NUMERO: ${parsed.data.numero} - EXTRACTO: ${parsed.data.extracto} - OFICINA: ${parsed.data.oficina} - REPARTICION: ${parsed.data.reparticion} - DESDE: ${parsed.data.desde}`
        }
        return response
    }

    async getMinChacoAPI (nro: string,httpService:HttpService) {
        interface MovimientoTramite {
            fecha: string;
            hora: string;
            origen: string;
            situacionDestino: string;
        }
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
        const {data} = await firstValueFrom(httpService.post(url,params.toString(),{
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

    async getContaduriaGralApi (nro: string,httpService:HttpService) {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        const url = `https://nportal.cgpc.gob.ar/documentos/apiweb/Consultas-Web/consulta?expediente=%27${nro}%27`
        const {data} = await firstValueFrom(httpService.get(url,{httpsAgent}))
        return data
    }
}
