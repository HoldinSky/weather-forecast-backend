import { AxiosHeaders, Method, RawAxiosRequestHeaders } from "axios";

type MethodsHeaders = Partial<{
  [Key in Method as Lowercase<Key>]: AxiosHeaders;
} & {common: AxiosHeaders}>;

type HeadersType = (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders

export enum RequestMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface RequestOptions<RequestData, RequestParams> {
  url: string;
  method: RequestMethods;
  data?: RequestData;
  params?: RequestParams | object;
  headers?: HeadersType;
}

export interface ResponseError {
  data: any;
  status: number | any;
}

export interface ResponseData<ResponseObject> {
  response: ResponseObject;
  error: ResponseError;
}
