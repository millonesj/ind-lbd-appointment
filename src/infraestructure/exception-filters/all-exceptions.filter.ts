import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AxiosException } from './exceptions/axios.exception';
import { DatabaseException } from './exceptions/database.exception';
import { DtoException } from './exceptions/dto.exception';
import { KnowException } from './exceptions/know.exception';
import { ErrorException } from './interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly dtoErrorException = new DtoException();
  private readonly axiosException = new AxiosException();
  private readonly knowException = new KnowException();
  private readonly databaseException = new DatabaseException();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const httpException =
      exception instanceof HttpException ? exception.getResponse() : null;
    const error: Record<string, any> = httpException
      ? exception.response.data || exception.response.message
      : exception.message;
    this.logger.error(
      'AllExceptionsFilter',
      exception?.response && exception.response.from
        ? exception.response.from
        : error,
    );

    const path = request.originalUrl;
    this.logger.error('AllExceptionsFilter', {
      path,
      error,
    });

    let errorResponse = {} as ErrorException;

    if (this.axiosException.validate(exception)) {
      console.log(1);
      errorResponse = this.axiosException.returnValidation(error, exception);
    } else if (this.knowException.validate(exception)) {
      console.log(2);
      errorResponse = this.knowException.returnValidation(error, exception);
      console.log(3);
    } else if (this.dtoErrorException.validate(exception)) {
      errorResponse = this.dtoErrorException.returnValidation(error, exception);
    } else if (this.databaseException.validate(exception)) {
      console.log(4);
      errorResponse = this.databaseException.returnValidation(error, exception);
    }

    return response
      .status(errorResponse?.status || HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        status: errorResponse?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: errorResponse?.message,
        path,
      });
  }
}
