import { validationsErrors } from './categories/100.validations.errors';
import { autentizationErrors } from './categories/200.autentication.errors ';
import { databaseErrors } from './categories/300.database.errors';
import { serverErrors } from './categories/400.server.errors';

export const errorCodes = {
  ...validationsErrors,
  ...autentizationErrors,
  ...databaseErrors,
  ...serverErrors,
};
