import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

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

    @IsBoolean()
    @IsNotEmpty()
    samabe: boolean
}