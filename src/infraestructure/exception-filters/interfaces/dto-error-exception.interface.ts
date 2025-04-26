import { ErrorException } from '../interfaces/error-response.interface';

export interface IDtoErrorException {
  validate(exception: any): boolean;
  returnValidation(error: any, exception: any): ErrorException;
}
