import {
  Controller,
  Get,
  Param,
  Query,
  Logger,
  Res,
  Body,
  Post,
  Delete,
} from '@nestjs/common'; // Pastikan Anda mengimpor Res dengan benar
import {
  ResOK,
  ResNotFound,
  ReplyError,
  DeleteResponse,
} from '../../helper/res.helper';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { ToCreateUserDto } from './create-user.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    @InjectModel(User)
    private UserModel: typeof User,
  ) {}

  @Get('uuid')
  findOne(@Query('uuid') uuid: string, @Res() reply) { 
    console.log(uuid);
    from(
      this.UserModel.findOne({
        where: { id: uuid },
      }),
    )
      .pipe(
        map((m) => m),
      )
      .subscribe({
        next: (v: User | any) => {
          if (v == null)
            reply.status(404).json(ResNotFound([{ key: 'id', value: uuid }]));
          else reply.json(ResOK([ToCreateUserDto(v)]));
        },
        error: (err) => ReplyError(err, this.logger, reply),
      });
  }

  @Delete(':id')
  async deleteUserById(@Query('id') id: string, @Res() reply) {
    try {
      const book = await this.UserModel.findOne({
        where: { id },
      });

      if (!book) {
        return reply.status(404).json(ResNotFound([{ key: 'id', value: id }]));
      }

      await book.destroy();

      reply.json(DeleteResponse());
    } catch (err) {
      ReplyError(err, this.logger, reply);
    }
  }

  @Get()
  findAll(@Res() reply) {
    from(
      this.UserModel.findAll(),
    )
      .pipe(
        map((m) => m),
      )
      .subscribe({
        next: (users: User[]) => {
          reply.json(ResOK(users.map((user) => ToCreateUserDto(user))));
        },
        error: (err) => ReplyError(err, this.logger, reply),
      });
  }

  @Post()
  createUser(@Body() createUserDto: User, @Res() reply) {
    from(
      this.UserModel.create(createUserDto),
    )
      .pipe(
        map((m) => m),
      )
      .subscribe({
        next: (user: User) => {
          reply.status(201).json(ResOK([ToCreateUserDto(user)]));
        },
        error: (err) => ReplyError(err, this.logger, reply),
      });
  }
}
