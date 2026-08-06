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
            const lastLog = `SELECT MAX(fecha) FROM public.glpi_sexp_estados_log WHERE exp_id = $1`
            const fecha:string = (await conn.query(lastLog,[id])).rows[0]["max"]
            const sqlLogEstado = `INSERT INTO public.glpi_sexp_estados_log(fecha, prev, post, exp_id,fecha_prev) VALUES (NOW(), $1, $2, $3, $4);`
            await conn.query(sqlLogEstado, [prev_estado, data.value, id, fecha])

        }
        if(data.prop !== "seguimiento") {
            const log = `INSERT INTO public.glpi_sexp_expediente_log(exp_id, col, des,user_id,prev) VALUES ($1, $2, $3, $4,(SELECT ${data.prop} FROM public.glpi_sexp_expediente WHERE exp_id = ${id}));`
            const sql = `UPDATE public.glpi_sexp_expediente SET ${data.prop}=$1, last_mod=NOW(), fecha_ult_mod=NOW()  WHERE exp_id = $2;`
            await conn.query(log,[id,data.prop,data.value,data.userId])
            await conn.query(sql,[data.value,id])
        }
        else {
            const log = `INSERT INTO public.glpi_sexp_expediente_log(exp_id, col, des,user_id) VALUES ($1, $2, $3, $4);`
            await conn.query(log,[id,data.prop.toUpperCase(),data.value,data.userId])
        }

        await conn.end()
        return `Expediente actualizado.`
    }
    async getExpedientes () {
        const sql = `SELECT * FROM public.glpi_sexp_expediente order by fecha_presentacion DESC;`
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
        ORDER BY l.fecha DESC LIMIT 100;`
        const conn = clientReturner()
        await conn.connect()
        const exps = (await conn.query(sql)).rows
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
