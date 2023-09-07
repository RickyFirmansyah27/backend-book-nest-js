import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { PaginateOption } from '../helper/pagination.helper';
import { BookController } from './book/book.controller';
import { Book } from './book/book.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'db_coding',
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([
      User,
      Book
    ]), 
  ],
  controllers: [
    UserController,
    BookController
  ],
  providers: [PaginateOption],
})
export class AppModule {}
