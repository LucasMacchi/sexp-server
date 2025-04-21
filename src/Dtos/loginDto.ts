import { IsNotEmpty, IsString } from "class-validator";

export default class loginDto {
    @IsString()
    @IsNotEmpty()
    email: string
}