import { ToUpdateAuthUserDto } from './update-auth-user.dto';
import { UserDTO } from './user.dto'; // Gantilah 'UserDTO' dengan nama yang sesuai

describe('ToUpdateAuthUserDto', () => {
  it('should convert a UserDTO to UpdateEmailPasswordDto', () => {
    // Membuat contoh UserDTO untuk diuji
    const user: UserDTO = {
      id: '1',
      name: 'John Doe',
      email: 'user@example.com',
      age: 30,
      gender: 'male',
      password: 'password123',
    };

    // Memanggil fungsi ToUpdateAuthUserDto untuk mengonversi UserDTO
    const updateDto = ToUpdateAuthUserDto(user);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan
    expect(updateDto).toEqual({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('should handle undefined UserDTO', () => {
    // Memanggil fungsi ToUpdateAuthUserDto dengan parameter null/undefined
    const updateDto = ToUpdateAuthUserDto(null);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan (semua properti harus undefined)
    expect(updateDto).toEqual({
      email: undefined,
      password: undefined,
    });
  });
});
