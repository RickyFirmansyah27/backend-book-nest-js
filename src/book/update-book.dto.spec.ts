import { FromUpdateBookDto, UpdateBookDto } from './update-book.dto';

describe('FromUpdateBookDto', () => {
  it('should convert a FromUpdateBookDto to UpdateBookDto', () => {
    // Membuat contoh BookDto untuk diuji
    const book: UpdateBookDto = {
        title: 'Myth of Ragnarok',
        author: 'Ricky',
        year: 2022,
        vol: '1'
    };

    // Memanggil fungsi FromUpdateBookDto untuk mengonversi BookDto
    const updateDto = FromUpdateBookDto(book);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan
      expect(updateDto).toEqual({
          title: 'Myth of Ragnarok',
          author: 'Ricky',
          year: 2022,
          vol: '1'
      });
  });

  it('should handle undefined BookDto', () => {
    // Memanggil fungsi FromUpdateBookDto dengan parameter null/undefined
    const updateDto = FromUpdateBookDto(null);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan (semua properti harus undefined)
    expect(updateDto).toEqual({
      title: undefined,
      author: undefined,
      year: undefined,
      vol: undefined,
    });
  });
});
