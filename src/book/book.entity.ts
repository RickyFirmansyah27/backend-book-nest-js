import { Column, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'book', 
  timestamps: true,
})
export class Book extends Model<Book> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  judul: string;

  @Column
  pengarang: string;

  @Column
  thn_rilis: number;

  @Column
  volume: string;
}
