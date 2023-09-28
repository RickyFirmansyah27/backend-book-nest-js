import { User } from './user.entity';

export interface UserDTO {
    id: string,
    name: string;
    email: string;
    age: number;
    gender: string;
    password: string;
}

export const ToDto = (e: User): UserDTO => ({
  id: e.id,
  name: e.name,
  email: e.email,
  age: e.age,
  gender: e.gender,
  password: e.password
});
