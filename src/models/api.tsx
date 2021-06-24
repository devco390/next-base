export interface IApiResponse {
  data?: any
  code: number
  error?: any
}

export enum RESPONSE_CODES {
  SUCCESS = 200,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}
