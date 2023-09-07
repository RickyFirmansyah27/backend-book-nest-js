import { Book } from './book.entity';

export interface CreateBookDto {
    id: string,
    judul: string;
    author: string;
    year: number;
    vol: string;
  }
  
  export const ToCreateBookDto = (e: Book): CreateBookDto => ({
    id: e?.id,
    judul: e?.judul,
    author: e?.pengarang,
    year: e?.thn_rilis,
    vol: e?.volume,
  });
  