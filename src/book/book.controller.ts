import {
  Controller,
  Get,
  Query,
  Logger,
  Res,
  Body,
  Post,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import {
  ResOK,
  ResNotFound,
  ReplyError,
  DeleteResponse,
  ResDto,
} from '../../helper/res.helper';
import { Subject, from, of } from 'rxjs';
import { map, switchMap, tap, toArray } from 'rxjs/operators';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from './book.entity';
import { CreateBookDto, ToCreateBookDto } from './create-book.dto';
import { PaginateOption } from '../../helper/pagination.helper';
import { QueryParamsBook, ToSeqWhere, ToSeqAttributes } from './book.params';


@Controller('books')
export class BookController {
  private readonly logger = new Logger(BookController.name);
  constructor(
    @InjectModel(Book)
    private BookModel: typeof Book,
    private readonly paginate: PaginateOption
  ) { }

  @Get('id')
  findBookById(@Query('uuid') uuid: string, @Res() reply) {
    from(
      this.BookModel.findOne({
        where: { id: uuid },
      }),
    )
      .pipe(
        map((m) => m),
      )
      .subscribe({
        next: (v: Book | any) => {
          if (v == null)
            reply.status(404).json(ResNotFound([{ key: 'id', value: uuid }]));
          else reply.json(ResOK([ToCreateBookDto(v)]));
        },
        error: (err) => ReplyError(err, this.logger, reply),
      });
  }

  @Delete(':id')
  async deleteBookById(@Query('id') id: string, @Res() reply) {
    try {
      const book = await this.BookModel.findOne({
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
  findAll(@Query() q: QueryParamsBook, @Res() reply) {
    const pageOptions = {
      page: (q.page < 0 ? 0 : q.page) || 0,
      size:
        (q.size < 0 || q.size > this.paginate.MaxSize
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
    const query = {
      where,
      attributes,
      limit: pageOptions.size,
      offset: pageOptions.page * pageOptions.size,
    };
  
    if (q.download) {
      delete query['limit'];
      delete query['offset'];
    }
  
    const result = new Subject<ResDto<CreateBookDto>>();
    from(this.BookModel.count({ where }))
      .pipe(
        switchMap((v: number) => {
          pagination.totalCount = v;
          pagination.totalPage = Math.ceil(
            pagination.totalCount / pageOptions.size,
          );
          if (pageOptions.page > pagination.totalPage) {
            throw new BadRequestException(['Page is invalid']);
          }
          return from(this.BookModel.findAll(query));
        }),
        map((books: Book[]) => {
          return books.map((book: Book) => ToCreateBookDto(book));
        }),
        toArray(),
      )
      .subscribe({
        next: (data) => {
          if (!q.download) {
            reply.json(ResOK(data, pagination));
          } else {
            //To Do Download to Excel
            reply.json(ResOK(data, pagination));
          }
        },
        complete: () => {
          result.complete();
        },
        error: (err) => ReplyError(err, this.logger, reply),
      });
  }


  // Pagination via x-count
  // @Get()
  // async findAll(@Query() q: QueryParamsBook, @Res() reply) {
  //   const page = Math.max(0, q.page || 0);
  //   const size = Math.min(q.size || this.paginate.MaxSize, this.paginate.MaxSize);

  //   const where = ToSeqWhere(q);
  //   const attributes = ToSeqAttributes(q);

  //   const pagination = {
  //     where,
  //     attributes,
  //     limit: size,
  //     offset: page * size,
  //   };

  //   if (q.download) {
  //     delete pagination.limit;
  //     delete pagination.offset;
  //   }

  //   try {
  //     const result = await this.BookModel.findAndCountAll(pagination);
  //     const totalCount = result.count;
  //     const totalPage = Math.ceil(totalCount / size);

  //     const data = result.rows.map((book) => ToCreateBookDto(book));

  //     reply.header('X-Total-Count', totalCount);
  //     reply.header('X-Total-Page', totalPage);

  //     reply.json(ResOK(data));
  //   } catch (err) {
  //     return ReplyError(err, this.logger, reply);
  //   }
  // }

  @Post()
  createBook(@Body() createBookDto: Book, @Res() reply) {
    from(
      this.BookModel.create(createBookDto),
    )
      .pipe(
        map((m) => m),
      )
      .subscribe({
        next: (Book: Book) => {
          reply.status(201).json(ResOK([ToCreateBookDto(Book)]));
        },
        error: (err) => ReplyError(err, this.logger, reply),
      });
  }
}
