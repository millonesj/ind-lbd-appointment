export const serverErrors = {
  UNKNOWN_ERROR: {
    code: 400,
    message: 'Error interno del servidor: error desconocido',
  },
  NOT_FOUND: {
    code: 401,
    message:
      'Lo sentimos, el recurso que estás buscando no pudo ser encontrado',
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    message: 'Servicio externo no disponible',
  },
};
