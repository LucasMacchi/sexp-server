import {IsString, IsNotEmpty } from "class-validator";

export default class modexpDto {
    @IsString()
    @IsNotEmpty()
    prop: string

    @IsString()
    @IsNotEmpty()
    value: string
}
