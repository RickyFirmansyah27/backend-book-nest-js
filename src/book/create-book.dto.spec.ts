import { CreateBookDto, ToCreateBookDto } from "./create-book.dto";
import { BookDto, FromDto } from './book.dto'

describe('ToCreateBookDto', () => {
  it('should convert a User to a CreateBookDto', () => {
    const Book: BookDto = {
      id: '1',
      judul: 'Myth of Ragnarok',
      author: 'Ricky',
      year: 2022,
      vol: '1'
    };

    const CreateBookDto: CreateBookDto = FromDto(Book);

    // Modify this expectation to match the expected structure of CreateBookDto
    expect(CreateBookDto).toEqual({
      id: '1',
      judul: 'Myth of Ragnarok',
      author: 'Ricky',
      year: 2022,
      vol: '1'
    });
  });

  it('should handle undefined user', () => {
    const CreateBookDto: CreateBookDto = ToCreateBookDto(undefined);

    // Modify this expectation to match the expected structure of CreateBookDto
    expect(CreateBookDto).toEqual({
      uuid: undefined,
      name: undefined,
      email: undefined,
      age: undefined,
      gender: undefined,
      password: undefined,
    });
  });
});
