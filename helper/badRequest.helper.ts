import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { ResBadRequest } from './res.helper';
  
  @Catch(BadRequestException)
  export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
  
      response.status(status).json(ResBadRequest(exception));
    }
  }
  