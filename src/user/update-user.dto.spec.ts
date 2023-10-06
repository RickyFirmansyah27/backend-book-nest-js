import { ToUpdateUserDto } from './update-user.dto';
import { UserDTO } from './user.dto';

describe('ToUpdateUserDto', () => {
  it('should convert a UserDTO to UpdateUserDto', () => {
    // Membuat contoh UserDTO untuk diuji
    const user: UserDTO = {
      id: '1',
      name: 'John Doe',
      email: 'user@example.com',
      age: 30,
      gender: 'male',
      password: 'password123',
    };

    // Memanggil fungsi ToUpdateUserDto untuk mengonversi UserDTO
    const updateDto = ToUpdateUserDto(user);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan
    expect(updateDto).toEqual({
      name: 'John Doe', // Sesuaikan dengan properti yang sesuai
      age: 30, // Sesuaikan dengan properti yang sesuai
      gender: 'male', // Sesuaikan dengan properti yang sesuai
    });
  });

  it('should handle undefined UserDTO', () => {
    // Memanggil fungsi ToUpdateUserDto dengan parameter null/undefined
    const updateDto = ToUpdateUserDto(null);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan (semua properti harus undefined)
    expect(updateDto).toEqual({
      name: undefined,
      age: undefined,
      gender: undefined,
    });
  });
});
