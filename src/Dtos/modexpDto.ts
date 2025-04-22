import {IsString, IsNumber } from "class-validator";

export default class modexpDto {
    @IsString()
    ultima_mod: string

    @IsNumber()
    estado_id: number

    @IsString()
    descripcion: string
}