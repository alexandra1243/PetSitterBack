import { Error } from 'mongoose';
import { Response } from 'express';

import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch(Error)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status: number = HttpStatus.BAD_REQUEST;
    let message = '';
    const error = 'Bad Request';

    switch (exception.name) {
      case 'CastError':
        message = 'Invalid Object Id sent';
        break;
      default:
        break;
    }

    response
      .status(status)
      .json({ statusCode: status, message, error });
  }
}