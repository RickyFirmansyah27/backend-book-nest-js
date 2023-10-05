export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  password: string;
}

export interface CreateUserDto {
  uuid: string | '';
  name: string | '';
  email: string | '';
  age: number | '';
  gender: string | '';
  password: string | '';
}

export const ToCreateUserDto = (e: User): CreateUserDto => ({
    uuid: e?.id,
    name: e?.name,
    email: e?.email,
    age: e?.age,
    gender: e?.gender,
    password: e?.password,
});

describe('ToCreateUserDto', () => {
  it('should convert a User to a CreateUserDto', () => {
    const user: User = {
      id: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      gender: 'male',
      password: 'password123',
    };

    const createUserDto: CreateUserDto = ToCreateUserDto(user);

    // Modify this expectation to match the expected structure of CreateUserDto
    expect(createUserDto).toEqual({
      uuid: '12345', // Assuming you want to map id to uuid
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      gender: 'male',
      password: 'password123',
    });
  });

  it('should handle undefined user', () => {
    const createUserDto: CreateUserDto = ToCreateUserDto(undefined);

    // Modify this expectation to match the expected structure of CreateUserDto
    expect(createUserDto).toEqual({
      uuid: undefined,
      name: undefined,
      email: undefined,
      age: undefined,
      gender: undefined,
      password: undefined,
    });
  });
});
