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
        const editCon = `UPDATE public.glpi_sexp_expediente SET concepto='${data.concepto}' WHERE exp_id = ${id};`
        const editInv = `UPDATE public.glpi_sexp_expediente SET invitacion='${data.invitacion}' WHERE exp_id = ${id};`
        const editOrdenC = `UPDATE public.glpi_sexp_expediente SET orden_compra='${data.orden_compra}' WHERE exp_id = ${id};`
        const editImporte = `UPDATE public.glpi_sexp_expediente SET importe=${data.importe} WHERE exp_id = ${id};`
        const editNroExp = `UPDATE public.glpi_sexp_expediente SET numero_exp='${data.numero_exp}' WHERE exp_id = ${id};`
        const editNroF = `UPDATE public.glpi_sexp_expediente SET nro_factura='${data.nro_factura}' WHERE exp_id = ${id};`
        const editEstado = `UPDATE public.glpi_sexp_expediente SET estado_id=${data.estado_id} WHERE exp_id = ${id};`
        const editFecha = `UPDATE public.glpi_sexp_expediente SET fecha_ult_mod='${data.ultima_mod}' WHERE exp_id = ${id};`
        const editDes = `UPDATE public.glpi_sexp_expediente SET descripcion='${data.descripcion}' WHERE exp_id = ${id};`
        const editFechaFacturacion = `UPDATE public.glpi_sexp_expediente SET fecha_facturacion='${data.fecha_facturacion}' WHERE exp_id = ${id};`
        const editFechaTesoreria = `UPDATE public.glpi_sexp_expediente SET fecha_tesoreria='${data.fecha_tesoreria}' WHERE exp_id = ${id};`
        await conn.query(editInv)
        await conn.query(editOrdenC)
        if(data.concepto) await conn.query(editCon)
        if(data.fecha_tesoreria) await conn.query(editFechaTesoreria)
        if(data.fecha_facturacion) await conn.query(editFechaFacturacion)
        if(data.importe) await conn.query(editImporte)
        if(data.nro_factura) await conn.query(editNroF)
        if(data.numero_exp) await conn.query(editNroExp)
        if(data.estado_id) await conn.query(editEstado)
        if(data.ultima_mod) await conn.query(editFecha)
        if(data.descripcion) await conn.query(editDes)
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
}
