import { Injectable } from '@nestjs/common';
import expedienteDto from 'src/Dtos/expedienteDto';
import clientReturner from 'src/utils/clientReturner';

@Injectable()
export class ExpedienteService {

    async createExpediente (exp: expedienteDto){
        let des = ``
        const sql = `INSERT INTO public.glpi_sexp_expediente
        (service_id,user_id, numero_exp, concepto, periodo, 
        fecha_presentacion, fecha_ult_mod, nro_factura, 
        empresa_id, estado_id, importe, descripcion)
        VALUES(${exp.servicio_id},${exp.user_id} , '${exp.numero_exp}', 
        '${exp.concepto}', '${exp.periodo}', '${exp.fecha_presentacion}', 
        '${exp.fecha_presentacion}', '${exp.nro_factura}', ${exp.empresa_id},
         ${exp.estado_id}, ${exp.importe}, '${exp.descripcion}');`
        
        const conn = clientReturner()
        await conn.connect()
        await conn.query(sql)
        await conn.end()
    }
}
