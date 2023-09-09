// update-email-password.dto.ts

import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { User } from './user.entity';

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

export const ToUpdateUserDto = (e: User): UpdateUserDto => ({
    name: e?.name,
    gender: e?.gender,
    age: e?.age
});