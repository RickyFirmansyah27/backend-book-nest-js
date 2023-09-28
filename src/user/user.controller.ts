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
  BadRequestException,
  Patch,
  InternalServerErrorException,
} from '@nestjs/common'; // Pastikan Anda mengimpor Res dengan benar
import {
  ResOK,
  ResNotFound,
  ReplyError,
  DeleteResponse,
  NotFoundResponse,
  ResDto,
} from '../../helper/res.helper';
import { Subject, from, throwError } from 'rxjs';
import { catchError, map, switchMap, toArray } from 'rxjs/operators';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { CreateUserDto, ToCreateUserDto } from './create-user.dto';
import { UpdateEmailPasswordDto } from './update-auth-user.dto';
import { QueryParamsUser, ToSeqWhere, ToSeqAttributes, ToSortUser, ToSortData } from './user.params';
import { PaginateOption } from '../../helper/pagination.helper';
import { UpdateUserDto } from './update-user.dto';
import { UserDTO } from './user.dto';
import { ToExcelFile } from '../../helper/convertExcelFile.helper';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    @InjectModel(User)
    private UserModel: typeof User,
    private readonly paginate: PaginateOption
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
  findAll(@Query() q: QueryParamsUser, @Res() reply) {
    const pageOptions = {
      page: (q.page < 0 ? 0 : q.page) || 0,
      size: (q.size < 0 || q.size > this.paginate.MaxSize
        ? this.paginate.MaxSize
        : q.size) || this.paginate.MaxSize,
    };
  
    const pagination = {
      totalCount: 0,
      totalPage: 0,
      page: pageOptions.page,
      size: pageOptions.size,
    };
  
    const where = ToSeqWhere(q);
    const attributes = ToSeqAttributes(q);
    //Sort without ecnryption
    const order = ToSortData(q.sort);
    //Sort with encryption
    // const order = ToSortUser(q.sort);
    const query = {
      where,
      order,
      attributes,
      limit: pageOptions.size,
      offset: pageOptions.page * pageOptions.size,
    };
  
    if (q.download) {
      delete query['limit'];
      delete query['offset'];
    }
  
    const result = new Subject<ResDto<UserDTO>>();
    from(this.UserModel.count({ where })).pipe(
      switchMap((v: number) => {
        pagination.totalCount = v;
        pagination.totalPage = Math.ceil(pagination.totalCount / pageOptions.size);
        if (pageOptions.page > pagination.totalPage) {
          throw new BadRequestException(['Page is invalid']);
        }
        return from(this.UserModel.findAll(query));
      }),
      map((users: User[]) => users.map((user: User) => ToCreateUserDto(user))),
      toArray(),
      catchError((err) => {
        return throwError(new InternalServerErrorException('An error occurred.'));
      })
    ).subscribe({
      next: (data) => {
        if (!q.download) {
          reply.json(ResOK(data, pagination));
        } else {
          // Generate file when download is true
          const filename = 'user-list';
          const dataFile: CreateUserDto[] = data.map((d: CreateUserDto[]) => ({
            uuid: d['uuid'],
            name: d['name'],
            email: d['email'],
            age: d['age'],
            gender: d['gender'],
            password: d['password'],
           }));
          from(
            ToExcelFile(dataFile,filename),
          ).subscribe({
            next: (file) => {
              reply.setHeader(
                'Content-Disposition',
                `attachment; filename="${filename}.xlsx"`
              );
              reply.setHeader('Content-Type', 'text/xlsx');
              reply.sendFile(file);
            },
            error: (err) => ReplyError(err, this.logger, reply),
          });
        }
      },
      complete: () => {
        result.complete();
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
  updateAuth(
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

  @Patch(':uuid')
  updateUser(
    @Query('uuid') uuid: string,
    @Body() updateDto: UpdateUserDto,
    @Res() reply,
  ) {
    const result = new Subject<ResDto<UpdateUserDto>>();

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

          // Update user using dto body
          user.name = updateDto.name;
          user.gender = updateDto.gender;
          user.age = updateDto.age;


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
