import { HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { IDtoErrorException } from '../interfaces/dto-error-exception.interface';
import { ErrorException } from '../interfaces/error-response.interface';

export class AxiosException implements IDtoErrorException {
  validate(exception) {
    const isAxiosError = this.isAxiosError(exception);
    return isAxiosError;
  }

  returnValidation(error, exception): ErrorException {
    const axiosError = exception as AxiosError;
    const status =
      axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = axiosError.message;

    console.log(`Axios Error: ${status}, Error Message: ${message}`);

    if (exception?.response?.data) {
      return exception.response.data;
    }
  }

  private isAxiosError(error: any): boolean {
    return error.isAxiosError !== undefined;
  }
}
