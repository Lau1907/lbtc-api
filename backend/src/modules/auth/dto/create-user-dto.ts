import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  lastname?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'El usuario debe tener al menos 4 caracteres' })
  @MaxLength(30, { message: 'El usuario no puede tener más de 30 caracteres' })
  username?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100)
  password?: string;

  @IsString()
  role?: string;
}