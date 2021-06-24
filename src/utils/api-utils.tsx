import { IApiResponse, RESPONSE_CODES } from 'models/api'

export const transformSuccessResponse = (data: any): IApiResponse => {
  return { data, code: RESPONSE_CODES.SUCCESS }
}
export const transformNotFoundResponse = (error: any): IApiResponse => {
  return { error, code: RESPONSE_CODES.NOT_FOUND }
}
export const transformServerErrorResponse = (error: any): IApiResponse => {
  return { error, code: RESPONSE_CODES.SERVER_ERROR }
}
