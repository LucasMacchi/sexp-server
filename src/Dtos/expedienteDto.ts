import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export default class expedienteDto {
    @IsNumber()
    @IsNotEmpty()
    servicio_id: number

    @IsNumber()
    @IsNotEmpty()
    user_id:number

    @IsNumber()
    @IsNotEmpty()
    empresa_id: number

    @IsNumber()
    @IsNotEmpty()
    estado_id: number

    @IsNumber()
    @IsNotEmpty()
    importe: number

    @IsString()
    @IsNotEmpty()
    numero_exp: string

    @IsString()
    @IsNotEmpty()
    concepto: string

    @IsString()
    @IsNotEmpty()
    periodo: string

    @IsString()
    @IsNotEmpty()
    fecha_presentacion: string

    @IsString()
    @IsNotEmpty()
    nro_factura: string

    @IsString()
    descripcion: string
}

