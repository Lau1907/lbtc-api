import { IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El título no puede tener más de 100 caracteres' })
  name?: string;

  @IsString()
  @MaxLength(500, { message: 'La descripción no puede tener más de 500 caracteres' })
  description?: string;

  @IsBoolean()
  priority?: Boolean;

  @IsInt()
  user_id?: number;
}