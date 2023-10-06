// update-email-password.dto.ts

import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
// import { User } from './user.entity';
import { UserDTO } from './user.dto';

export class UpdateUserDto {
    @IsOptional()
    name: string;

    @IsOptional()
    @IsNumber()
    age: number;

    @IsOptional()
    @IsString()
    gender: string;
}

export const ToUpdateUserDto = (e: UserDTO): UpdateUserDto => ({
    name: e?.name,
    gender: e?.gender,
    age: e?.age
});