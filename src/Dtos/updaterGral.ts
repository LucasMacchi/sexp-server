import { IsNotEmpty, IsString, IsBoolean, IsEmail, IsArray, IsNumber } from "class-validator";

export default class registerDto {

    @IsString()
    @IsNotEmpty()
    numero_exp: string

    @IsString()
    @IsNotEmpty()
    gral: string
}