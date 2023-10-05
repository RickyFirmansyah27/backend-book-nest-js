// app.module.ts
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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([User, Book]),
  ],
  controllers: [UserController, BookController],
  providers: [PaginateOption],
})
export class AppModule {}
