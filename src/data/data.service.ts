import { Injectable } from '@nestjs/common';
import clientReturner from 'src/utils/clientReturner';

@Injectable()
export class DataService {
    async getterData (table: string) {
        const conn = clientReturner()
        await conn.connect()

        const sql = `SELECT * FROM public.${table};`
        const result = (await conn.query(sql)).rows
        await conn.end()
        return result
    }
    async addService (service: string) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `INSERT INTO public.glpi_sexp_servicios_1
                    (nombre)
                    VALUES('${service}');`
        await conn.query(sql)
        await conn.end()
        return "Servicio "+service+" creado."
    }
    async addEmpresa (empresa: string) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `INSERT INTO public.glpi_sexp_empresa_1
                    (nombre)
                    VALUES('${empresa}');`
        await conn.query(sql)
        await conn.end()
        return "Empresa "+empresa+" creada."
    }
    async addState (estado: string) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `INSERT INTO public.glpi_sexp_estado_1
                    (concepto)
                    VALUES('${estado}');`
        await conn.query(sql)
        await conn.end()
        return `Estado ${estado} creado.`
    }
    async addCliente (cliente: string,publico:boolean) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `INSERT INTO public.glpi_sexp_cliente
                    (descripcion,publico)
                    VALUES('${cliente}', ${publico});`
        await conn.query(sql)
        await conn.end()
        return `Cliente ${cliente} creado.`
    }
}
