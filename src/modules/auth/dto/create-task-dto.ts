import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsBoolean()
    @IsNotEmpty()
    priority?: Boolean;

    @IsInt({ message: 'Debe ser un número entero' })
    user_id?: number;
}