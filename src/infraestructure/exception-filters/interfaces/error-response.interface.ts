export interface ErrorException {
  status: number;
  code: number; //string;
  message: string;
}

export interface ErrorResponse {
  status: number;
  code: number;
  message: string;
  path: string;
}
