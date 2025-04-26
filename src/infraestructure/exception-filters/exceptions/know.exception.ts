import { CustomException } from '../../exceptions/custom-exception';
import { IDtoErrorException } from '../interfaces/dto-error-exception.interface';
import { ErrorException } from '../interfaces/error-response.interface';

export class KnowException implements IDtoErrorException {
  validate(exception) {
    return exception instanceof CustomException;
  }

  returnValidation(error, exception): ErrorException {
    return {
      status: exception?.response?.status,
      code: exception?.response?.code,
      message: exception?.response?.message,
    };
  }
}
