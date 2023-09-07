import { Column, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'user', 
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  age: number;

  @Column
  gender: string;

  @Column
  password: string;
}
