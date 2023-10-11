import { BookDto, FromDto } from './book.dto';

describe('ToDto', () => {
  it('should convert a book entity to UserDTO', () => {
    // Membuat contoh book entity untuk diuji
    const book: BookDto = {
      id: '1',
      judul: 'Myth of Ragnarok',
      author: 'Ricky',
      year: 2022,
      vol: '1'
    };

    // Memanggil fungsi ToDto dengan objek book
    const bookDto = FromDto(book);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan
    expect(bookDto).toEqual({
      id: '1',
      judul: 'Myth of Ragnarok',
      author: 'Ricky',
      year: 2022,
      vol: '1'
    });
  });
});
