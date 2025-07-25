import { IsNotEmpty, IsString, IsBoolean, IsEmail, IsArray, IsNumber } from "class-validator";

export default class registerDto {

    @IsString()
    @IsNotEmpty()
    first_name: string

    @IsString()
    @IsNotEmpty()
    last_name: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsBoolean()
    @IsNotEmpty()
    admin: boolean
}