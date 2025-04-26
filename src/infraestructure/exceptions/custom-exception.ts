import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, statusCode: number, code: number) {
    super({ code, status: statusCode, message }, statusCode);
  }
}

export class CustomExceptionString extends HttpException {
  constructor(message: string, statusCode: number, code: string) {
    super({ code, status: statusCode, message }, statusCode);
  }
}
