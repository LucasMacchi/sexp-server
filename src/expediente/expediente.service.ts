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
        const sql = `UPDATE public.glpi_sexp_expediente SET ${data.prop}='${data.value}' WHERE exp_id = ${id};`
        await conn.query(sql)
        await conn.end()
        return `Expediente actualizado.`
    }
    async getExpedientes () {
        const sql = `SELECT * FROM public.glpi_sexp_expediente;`
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
        empresa_id, estado_id, importe, descripcion, tipo)
        VALUES(${exp.servicio_id},${exp.user_id} , '${exp.numero_exp}', 
        '${exp.concepto}', '${exp.periodo}', '${exp.fecha_presentacion}', 
        '${exp.fecha_presentacion}', '${exp.nro_factura}', ${exp.empresa_id},
         ${exp.estado_id}, ${exp.importe}, '${exp.descripcion}'
         , '${exp.tipo}');`
        
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
        //console.log(exps)
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
