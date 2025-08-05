import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class {
    @IsString()
    @IsNotEmpty()
    fechaInicio: string

    @IsString()
    @IsNotEmpty()
    fechaFin: string

    @IsString()
    @IsNotEmpty()
    cco: string
}