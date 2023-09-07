import { User } from './user.entity';

export interface CreateUserDto {
    uuid: string,
    name: string;
    email: string;
    age: number;
    gender: string;
    password: string;
  }
  
  export const ToCreateUserDto = (e: User): CreateUserDto => ({
    uuid: e?.id,
    name: e?.name,
    email: e?.email,
    age: e?.age,
    gender: e?.gender,
    password: e?.password,
  });
  