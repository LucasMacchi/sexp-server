import {IsString, IsNotEmpty, IsNumber } from "class-validator";

export default class modexpDto {
    @IsString()
    @IsNotEmpty()
    prop: string

    @IsString()
    @IsNotEmpty()
    value: string

    @IsNumber()
    @IsNotEmpty()
    userId: number
}
