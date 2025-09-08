import { IsNotEmpty, IsString, IsNumber, IsBoolean } from "class-validator";


export default class {

    @IsString()
    @IsNotEmpty()
    fecha: string

    @IsString()
    @IsNotEmpty()
    comprobante: string

    @IsString()
    @IsNotEmpty()
    tipo: string

    @IsString()
    @IsNotEmpty()
    pv: string

    @IsString()
    @IsNotEmpty()
    nro: string

    @IsString()
    @IsNotEmpty()
    prov_cuit: string

    @IsString()
    @IsNotEmpty()
    prov_name: string

    @IsNumber()
    @IsNotEmpty()
    prov_cod: number

    @IsNumber()
    @IsNotEmpty()
    provsiv_cod: number

    @IsNumber()
    @IsNotEmpty()
    proprv_codigo: number

    @IsNumber()
    @IsNotEmpty()
    neto: number

    @IsNumber()
    @IsNotEmpty()
    ivapor: number

    @IsNumber()
    @IsNotEmpty()
    iva: number

    @IsNumber()
    @IsNotEmpty()
    total: number

    @IsString()
    @IsNotEmpty()
    concepto: string

    @IsString()
    @IsNotEmpty()
    concepto_cod: string

    @IsBoolean()
    @IsNotEmpty()
    samabe: boolean
}