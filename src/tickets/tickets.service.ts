import { Injectable } from '@nestjs/common';
import addTicketDto from 'src/Dtos/addTicketDto';
import clientReturner from 'src/utils/clientReturner';
import conceptos from "./conceptos.json"
import * as fs from 'fs';


interface ITicket {
    fecha: string,
    comprobante: string,
    tipo: string,
    pv: string,
    nro: string,
    prov_cuit: number,
    prov_name: string,
    prov_cod: number,
    provsiv_cod: number,
    proprv_cod: number,
    neto: number,
    ivapor: number,
    iva: number,
    total: number,
    concepto: string,
    concepto_cod: string,
    ticket_id: number
}

@Injectable()
export class TicketsService {

    async addTicket (data: addTicketDto) {
        const conn = clientReturner()
        await conn.connect()
        const fechaParsed = data.fecha.replaceAll("-","")
        const sql = `INSERT INTO public.glpi_sexp_ticket
        (comprobante, tipo, pv, nro, prov_cuit, prov_name, neto, ivapor, iva, total, concepto,
        prov_cod, provsiv_cod, proprv_cod, concepto_cod, fecha)
        VALUES('${data.comprobante}', '${data.tipo}', '${data.pv}', '${data.nro}', 
        '${data.prov_cuit}', '${data.prov_name}', ${data.neto}, 
        ${data.ivapor}, ${data.iva}, ${data.total}, '${data.concepto}', ${data.prov_cod},
        ${data.provsiv_cod},${data.proprv_codigo}, '${data.concepto_cod}', '${fechaParsed}');`
        await conn.query(sql)
        await conn.end()
        return `Ticker creado.`
    }

    async getProveedores () {
        const conn = clientReturner()
        await conn.connect()
        const sql = `SELECT * FROM public.glpi_sexp_proveedor p order by p.pro_razsoc ASC;`
        const rows = (await conn.query(sql)).rows
        await conn.end()
        return rows
    }

    getConceptos () {
        return conceptos.conceptos
    }

    async createTxt () {
        const conn = clientReturner()
        await conn.connect()
        const cco = 11123
        const rows:ITicket[] = (await conn.query(`SELECT * FROM public.glpi_sexp_ticket;`)).rows
        const itemsArray: string[] = this.createItemTxt(rows)
        const txt = {
            cabecera: this.createCabeceraTxt(rows),
            items: this.createItemTxt(rows),
            medpago: this.createMedPagosTxt(rows),
            cco: this.createCcoTxt(rows, cco)
        }
        return txt

    }

    private fillEmpty (data: string, total: number, all: boolean, string: boolean, ceros: boolean): string {
        if(all){
            let newStr = ""
            for (let index = 1; index <= total; index++) {
                newStr = " "+newStr
            }
            return newStr
        }
        else {
            if(data.length === total) return data
            else {
                let newStr = data
                const diff = total - data.length
                //console.log("LENGTH: "+data.length+"/ TOTAL: "+total+"/ DATA: "+data)
                for (let index = 1; index <= diff; index++) {
                    if(string) newStr = newStr + " "
                    else if(ceros) newStr = "0"+newStr
                    else newStr = " "+newStr
                }
                return newStr
            }
        }

    }

    private cuitParserFn (cuit: number): string {
        const cuitStr = cuit.toString()
        let newCuit = ""
        for (let i = 0; i < cuitStr.length; i++) {
            newCuit += cuitStr[i]
            if(i === 1 || i === 9) newCuit +="-"
        }
        
        return newCuit
    }

    private createCabeceraTxt (tickets: ITicket[]) {
        let cabeceraLines: string[] = []
        const blank1 = [15,15,8,8,8,8,8,8,4,25,1,15,8,1,4,4,15,15,1,1,8,3,3,8,8,6]
        const lines = tickets.length
        for (let index = 0; index < lines; index++) {
            let line = ""
            const t = tickets[index]
            //Comprobante
            line += this.fillEmpty(t.comprobante,3,false,false,true)
            //Letra
            line += this.fillEmpty(t.tipo,1,false,false,false)
            //Punto de venta
            line += this.fillEmpty(t.pv,5,false,false,true)
            //Nro comprobante
            line += this.fillEmpty(t.nro,8,false,false,true)
            //nro hasta
            line += this.fillEmpty("",8,true,false,false)
            //fecha comprobante
            line += this.fillEmpty(t.fecha,8,false,true,false)
            //cod prov
            line += this.fillEmpty(t.prov_cod.toString(),6,false,false,true)
            //razon social prov
            line += this.fillEmpty(t.prov_name,40,false,true,false)
            //tipo docu
            line += this.fillEmpty("1",2,false,true,false)
            //provincia de prov
            line += this.fillEmpty(t.proprv_cod.toString(),3,false,false,true)
            //situacion iva prov
            line += this.fillEmpty(t.provsiv_cod.toString(),1,false,false,false)
            //CUIT prov
            line += this.fillEmpty(t.prov_cuit.toString(),11,false,false,false)
            //Nro igresos brutos prov (igual cuit)
            line += this.fillEmpty(this.cuitParserFn(t.prov_cuit),15,false,true,false)
            //Cod de clasificacion adicional prov 1 -- PROBAR SIN NADA
            line += this.fillEmpty("",4,true,true,false)
            //Cod de clasificacion adicional prov 2
            line += this.fillEmpty("",4,true,true,false)
            //cCondicion de pago
            line += this.fillEmpty("1",3,false,true,false)
            //Codigo de causa de emision
            line += this.fillEmpty("",4,true,true,false)
            //fecha vencimiento
            line += this.fillEmpty(t.fecha,8,false,true,false)
            //Importe total comprobante
            line += this.fillEmpty(t.total.toString(),16,false,false,false)
            //Apertura contable
            line += this.fillEmpty("",4,true,true,false)
            //Direcion prov
            line += this.fillEmpty("",30,true,true,false)
            //Cod postal prov
            line += this.fillEmpty("",8,true,true,false)
            //localidad prov
            line += this.fillEmpty("",25,true,true,false)
            //Actualiza stock
            line += this.fillEmpty("N",1,false,true,false)
            //Desc cla adc 1 --- nro despacho
            blank1.forEach((s,i) => {
                if(i > 1 && i < 6) line += this.fillEmpty("0.00",s,false,false,false)
                else line += this.fillEmpty("",s,true,true,false)
                
            });

            cabeceraLines.push(line)
        }
        return cabeceraLines
    }

    private createItemTxt (tickets: ITicket[]) {
        let itemLines: string[] = []
        const blank = [3,4,25,4,25,6,40,15,15,15,20,8,20,50,8,3]
        const lines = tickets.length
        for (let index = 0; index < lines; index++) {
            let line = ""
            const t = tickets[index]
            //Comprobante
            line += this.fillEmpty(t.comprobante,3,false,false,true)
            //Letra
            line += this.fillEmpty(t.tipo,1,false,false,false)
            //Punto de venta
            line += this.fillEmpty(t.pv,5,false,false,true)
            //Nro comprobante
            line += this.fillEmpty(t.nro,8,false,false,true)
            //nro hasta
            line += this.fillEmpty("",8,true,false,false)
            //fecha comprobante
            line += this.fillEmpty(t.fecha,8,false,true,false)
            //cod prov
            line += this.fillEmpty(t.prov_cod.toString(),6,false,false,true)
            //Tipo de item
            line += this.fillEmpty("C",1,false,true,false)
            //Codigo del concepto
            line += this.fillEmpty(t.concepto_cod,23,false,true,false)
            //cant unidad med 1
            line += this.fillEmpty("1.00",16,false,false,false)
            //cant unidad med 2
            line += this.fillEmpty("0.00",16,false,false,false)
            //des del concepto
            line += this.fillEmpty(t.concepto,50,false,true,false)
            //prec unitario no iva
            line += this.fillEmpty(t.neto.toString(),16,false,false,false)    
            //tasa iva ins
            line += this.fillEmpty(t.ivapor.toString()+".00",8,false,false,false)
            //tasa iva no ins
            line += this.fillEmpty("0.00",8,false,false,false)
            //imp iva ins
            line += this.fillEmpty(t.iva.toString(),16,false,false,false)
            //imp iva no ins
            line += this.fillEmpty("0.00",16,false,false,false)
            //imp total no iva
            line += this.fillEmpty(t.neto.toString(),16,false,false,false)
            //imp dto come
            line += this.fillEmpty("0.00",16,false,false,false)
            //imp dto fin
            line += this.fillEmpty("0.00",16,false,false,false)
            //cod conp no agravado
            line += this.fillEmpty("",4,false,true,false)
            //imp conp no agravado
            line += this.fillEmpty("0.00",16,false,false,false)
            //tipo iva
            line += this.fillEmpty("1",1,false,false,false)
            //imp dto linea
            line += this.fillEmpty("0.00",16,false,false,false)
            //deposito
            line += this.fillEmpty("",3,false,true,false)
            //partida
            line += this.fillEmpty("",26,true,true,false)
            //tasa dto item
            line += this.fillEmpty("0.00",8,false,false,false)
            //imp del renglon
            line += this.fillEmpty(t.neto.toString(),16,false,false,false)
            //imp credito fisc
            line += this.fillEmpty("1",1,false,true,false)
            //rubro credito fisc
            line += this.fillEmpty("0",1,false,true,false)
            blank.forEach((s) => {
                line += this.fillEmpty("",s,true,true,false)    
            });
            itemLines.push(line)
        }
        return itemLines
    }
    private createMedPagosTxt (tickets: ITicket[]) {
        let itemLines: string[] = []
        const blank = [15,25,25,30,30,8,3,25,30]
        const lines = tickets.length
        for (let index = 0; index < lines; index++) {
            let line = ""
            const t = tickets[index]
            //Comprobante
            line += this.fillEmpty(t.comprobante,3,false,false,true)
            //Letra
            line += this.fillEmpty(t.tipo,1,false,false,false)
            //Punto de venta
            line += this.fillEmpty(t.pv,5,false,false,true)
            //Nro comprobante
            line += this.fillEmpty(t.nro,8,false,false,true)
            //nro hasta
            line += this.fillEmpty("",8,true,false,false)
            //fecha comprobante
            line += this.fillEmpty(t.fecha,8,false,true,false)
            //cod prov
            line += this.fillEmpty(t.prov_cod.toString(),6,false,false,true)
            //medio de pago
            line += this.fillEmpty("1",1,false,false,false)
            //Moneda
            line += this.fillEmpty("1",3,false,true,false)
            //Tipo de cambio
            line += this.fillEmpty("UNI",3,false,true,false)
            //Caja
            line += this.fillEmpty("CAJAADM",15,false,true,false)
            //Tipo de CHEQU
            line += this.fillEmpty("",3,false,true,false)
            //fecha venc
            line += this.fillEmpty("",8,false,true,false)
            //import mov
            line += this.fillEmpty(t.total.toString(),16,false,false,false)
            //nro cheque
            line += this.fillEmpty("",8,false,true,false)
            //cod de bnco
            line += this.fillEmpty("",3,false,true,false)
            //surc bnco
            line += this.fillEmpty("",4,false,true,false)
            //clearing
            line += this.fillEmpty("0",3,false,false,false)
            //Origen
            line += this.fillEmpty("",1,false,true,false)
            //cod cuent bancaria --- telefono del librador
            blank.forEach((s) => {
                line += this.fillEmpty("",s,true,true,false)    
            });
            //Importe del mov mod lcal
            line += this.fillEmpty(t.total.toString(),16,false,false,false)

            itemLines.push(line)
        }
        return itemLines
    }
    private createCcoTxt (tickets: ITicket[], cco: number) {
        let itemLines: string[] = []
        const lines = tickets.length
        for (let index = 0; index < lines; index++) {
            let line = ""
            const t = tickets[index]
            //Comprobante
            line += this.fillEmpty(t.comprobante,3,false,false,true)
            //Letra
            line += this.fillEmpty(t.tipo,1,false,false,false)
            //Punto de venta
            line += this.fillEmpty(t.pv,5,false,false,true)
            //Nro comprobante
            line += this.fillEmpty(t.nro,8,false,false,true)
            //nro hasta
            line += this.fillEmpty("",8,true,false,false)
            //fecha comprobante
            line += this.fillEmpty(t.fecha,8,false,true,false)
            //cod prov
            line += this.fillEmpty(t.prov_cod.toString(),6,false,false,true)
            //Nro de renglon
            line += this.fillEmpty("",3,true,false,false)
            //cco
            line += this.fillEmpty(cco.toString(),8,false,false,false)
            //porncentaje
            line += this.fillEmpty("100%",16,false,false,false)
            //porncentaje
            line += this.fillEmpty(t.total.toString(),16,false,false,false)

            itemLines.push(line)
        }
        return itemLines
    }

}
