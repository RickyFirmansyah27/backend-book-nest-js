import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Book } from './book.entity';

export class UpdateBookDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    author: string;

    @IsOptional()
    @IsNumber()
    year: number;

    @IsOptional()
    @IsString()
    vol: string;
}

export const toUpdateAuthUserDto = (e: Book): UpdateBookDto => ({
    title: e?.judul,
    author: e?.pengarang,
    year: e?.thn_rilis,
    vol: e?.volume,
});
