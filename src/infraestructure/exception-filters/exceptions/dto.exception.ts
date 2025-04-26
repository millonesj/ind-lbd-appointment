import { errorCodes } from '../../config/error-messages';
import { IDtoErrorException } from '../interfaces/dto-error-exception.interface';
import { ErrorException } from '../interfaces/error-response.interface';

export class DtoException implements IDtoErrorException {
  validate(exception) {
    return exception.response && exception.response?.statusCode === 400;
  }

  returnValidation(error, exception): ErrorException {
    if (error.includes('Unexpected string in JSON at position')) {
      return {
        status: exception.status,
        code: errorCodes.INVALID_JSON.code,
        message: errorCodes.INVALID_JSON.message,
      };
    }
    return {
      status: exception.status,
      code: errorCodes.INVALID_REQUEST_FIELD_DATA.code,
      message:
        error?.toString() == 'Bad Request'
          ? errorCodes.INVALID_REQUEST_FIELD_DATA.message
          : error,
    };
  }
}
