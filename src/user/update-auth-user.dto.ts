// update-email-password.dto.ts

import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
// import { User } from './user.entity';
import { UserDTO } from './user.dto';

export class UpdateEmailPasswordDto {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password: string;
}

export const ToUpdateAuthUserDto = (e: UserDTO): UpdateEmailPasswordDto => ({
    email: e?.email,
    password: e?.password,
});