import { IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";


export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    description?: string;

    @IsBoolean()
    @IsNotEmpty()
    priority?: Boolean;

    @IsInt({ message: 'Debe ser un número entero' })
    user_id?: number;
}