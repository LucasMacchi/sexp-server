import { Injectable } from '@nestjs/common';
import expedienteDto from 'src/Dtos/expedienteDto';
import modexpDto from 'src/Dtos/modexpDto';
import clientReturner from 'src/utils/clientReturner';

@Injectable()
export class ExpedienteService {

    async editExpediente (id: number, data: modexpDto) {
        const conn = clientReturner()
        await conn.connect()
        console.log(data)
        if(data.prop === "estado_id") {
            const sqlGetEst = `SELECT estado_id FROM public.glpi_sexp_expediente WHERE exp_id = ${id};`
            const prev_estado:number = (await conn.query(sqlGetEst)).rows[0]["estado_id"]
            console.log(prev_estado)
            const sqlLogEstado = `INSERT INTO public.glpi_sexp_estados_log(fecha, prev, post, exp_id,fecha_prev) VALUES (NOW(), $1, $2, $3,(SELECT MAX(fecha) FROM public.glpi_sexp_estados_log WHERE exp_id = $4));`
            await conn.query(sqlLogEstado, [prev_estado, data.value, id, id])

        }
        const sql = `UPDATE public.glpi_sexp_expediente SET ${data.prop}='${data.value}' WHERE exp_id = ${id};`
        await conn.query(sql)
        const sqlLastMod = `UPDATE public.glpi_sexp_expediente SET last_mod=NOW() WHERE exp_id = ${id};`
        await conn.query(sqlLastMod)
        await conn.end()
        return `Expediente actualizado.`
    }
    async getExpedientes () {
        const sql = `SELECT * FROM public.glpi_sexp_expediente order by fecha_presentacion DESC;;`
        const conn = clientReturner()
        await conn.connect()
        const exps = (await conn.query(sql)).rows
        await conn.end()
        return exps
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
         , '${exp.tipo}', 'false', ${exp.importe}, ${exp.client_id});`
        
        const conn = clientReturner()
        await conn.connect()
        await conn.query(sql)
        await conn.end()
    }
    async getUniqExpediente (id: number) {
        const sql = `SELECT * FROM public.glpi_sexp_expediente WHERE exp_id = ${id};`
        const conn = clientReturner()
        await conn.connect()
        const exps = (await conn.query(sql)).rows[0]
        const sqlLastSaw = `UPDATE public.glpi_sexp_expediente SET last_saw=NOW() WHERE exp_id = ${id};`
        await conn.query(sqlLastSaw)
        await conn.end()
        return exps
    }

    async getByNro (nro: string) {
        const sql = `SELECT exp_id FROM public.glpi_sexp_expediente WHERE numero_exp = '${nro}';`
        const conn = clientReturner()
        await conn.connect()
        const exps = (await conn.query(sql)).rows[0]
        console.log(exps)
        await conn.end()
        return exps
    }
}
