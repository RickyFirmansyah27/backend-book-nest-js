import { UserDTO, ToDto } from './user.dto';

describe('ToDto', () => {
  it('should convert a User entity to UserDTO', () => {
    // Membuat contoh User entity untuk diuji
    const user: UserDTO = {
      id: '1',
      name: 'John Doe',
      email: 'user@example.com',
      age: 30,
      gender: 'male',
      password: 'password123',
    };

    // Memanggil fungsi ToDto dengan objek User
    const userDto = ToDto(user);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan
    expect(userDto).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'user@example.com',
      age: 30,
      gender: 'male',
      password: 'password123',
    });
  });
});
