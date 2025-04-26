import { HttpStatus } from '@nestjs/common';
import { errorCodes } from '../../config/error-messages';
import { IDtoErrorException } from '../interfaces/dto-error-exception.interface';
import { ErrorException } from '../interfaces/error-response.interface';

export class DatabaseException implements IDtoErrorException {
  validate(exception) {
    return exception?.code === '23505';
  }

  returnValidation(error, exception): ErrorException {
    if (
      exception.message.includes(
        'duplicate key value violates unique constraint',
      )
    ) {
      const extractDuplicate = this.extractDuplicate(exception?.detail);

      return {
        status: HttpStatus.BAD_REQUEST,
        code: errorCodes.DUPLICATE_KEY.code,
        message: extractDuplicate
          ? `El siguiente parámetro viola el principio de unicidad: [ ${extractDuplicate} ]`
          : errorCodes.DUPLICATE_KEY.message,
      };
    }
  }

  private extractDuplicate(errorText: string): string | null {
    const keyValueMatch = errorText.match(/\(([^)]+)\)=\(([^)]+)\)/);
    return keyValueMatch ? `${keyValueMatch[1]}=${keyValueMatch[2]}` : null;
  }
}
