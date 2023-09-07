import { Book } from './book.entity';

export interface BookDto {
    id: string,
    judul: string;
    author: string;
    year: number;
    vol: string;
  }
  
  export const ToDto = (e: Book): BookDto => ({
    id: e?.id,
    judul: e?.judul,
    author: e?.pengarang,
    year: e?.thn_rilis,
    vol: e?.volume,
  });
  