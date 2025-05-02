import {IsString, IsNumber, IsBoolean } from "class-validator";

export default class modexpDto {
    @IsString()
    ultima_mod: string

    @IsNumber()
    estado_id: number

    @IsString()
    descripcion: string

    @IsNumber()
    importe: number

    @IsString()
    numero_exp: string

    @IsString()
    nro_factura: string

    @IsBoolean()
    invitacion: boolean

    @IsBoolean()
    orden_compra: boolean

    @IsString()
    ubicacion: string

    @IsString()
    fecha_facturacion: string
    
    @IsString()
    fecha_tesoreria: string
}