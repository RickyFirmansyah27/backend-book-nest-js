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
  Put,
} from '@nestjs/common'; // Pastikan Anda mengimpor Res dengan benar
import {
  ResOK,
  ResNotFound,
  ReplyError,
  DeleteResponse,
  NotFoundResponse,
  ResDto,
} from '../../helper/res.helper';
import { Subject, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { ToCreateUserDto } from './create-user.dto';
import { UpdateEmailPasswordDto } from './update-auth-user.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    @InjectModel(User)
    private UserModel: typeof User,
  ) { }

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
      const user = await this.UserModel.findOne({
        where: { id },
      });

      if (!user) {
        return reply.status(404).json(ResNotFound([{ key: 'id', value: id }]));
      }

      await user.destroy();

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

  @Put(':uuid')
  update(
    @Query('uuid') uuid: string,
    @Body() updateDto: UpdateEmailPasswordDto,
    @Res() reply,
  ) {
    const result = new Subject<ResDto<UpdateEmailPasswordDto>>();

    from(
      this.UserModel.findOne({
        where: { id: uuid },
      })
    )
      .pipe(
        switchMap((user: User) => {
          if (!user) {
            return reply.status(404).json(NotFoundResponse());
          }

          // Update email dan password berdasarkan DTO
          user.email = updateDto.email;
          user.password = updateDto.password;

          return from(user.save()).pipe(map(() => user));
        })
      )
      .subscribe({
        //Membaca ulang hasil update dto
        next: async () => {
          const updatedUser = await this.UserModel.findOne({
            where: { id: uuid },
          });
      
          if (!updatedUser) {
            reply.status(404).json(ResNotFound([{ key: 'id', value: uuid }]));
          } else {
            reply.json(ResOK([ToCreateUserDto(updatedUser)]));
          }
        },
        complete: () => {
          result.complete();
        },
        error: (err) => {
          ReplyError(err, this.logger, reply);
          result.error(err);
        },
      });
      
  }

}
