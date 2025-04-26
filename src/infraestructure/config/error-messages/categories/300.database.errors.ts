export const databaseErrors = {
  ERROR_DATABASE: {
    code: 300,
    message:
      'Ocurrió un error al intentar realizar una operación con los datos',
  },
  ERROR_DATABASE_CONNECTION: {
    code: 301,
    message: 'Error de base de datos: conexión fallida',
  },
  DUPLICATE_KEY: {
    code: 302,
    message: 'Ya existe un registro con esa clave única',
  },
  QUERY_ERROR_PARAMS_KEY: {
    code: 303,
    message:
      'Parámetros incorrectos en la consulta. Por favor, revisa e inténtalo de nuevo',
  },
};
