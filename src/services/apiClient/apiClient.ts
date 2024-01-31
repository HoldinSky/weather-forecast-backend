import axios from "axios";
import config from "../../../config/config";
import { RequestOptions, ResponseData } from "./apiClient.dto";

const defaultAxiosInstanceOptions = {
  baseURL: config().node.pythonServiceUrl
};

async function axiosRequest<RequestData, RequestParams, ResponseObject>(
  {
    url,
    method,
    data = null,
    params = {},
    headers,
  }: RequestOptions<RequestData, RequestParams>
): Promise<ResponseData<ResponseObject>> {
  const apiClient = axios.create(defaultAxiosInstanceOptions);

  const config = {
    url,
    method,
    data,
    params,
    headers
  };

  try {
    const response = await apiClient.request(config);

    return response?.data
      ? { response: response.data, error: null }
      : { response: null, error: null };
  } catch (error) {
    if (error.response) {
      return {
        response: null,
        error: {
          data: error.response.data,
          status: error.response.status
        }
      };
    }
    if (error.request) {
      return {
        response: null,
        error: {
          data: error.request,
          status: undefined
        }
      };
    }
    return {
      response: null,
      error: {
        data: error,
        status: undefined
      }
    };
  }
}

export default axiosRequest;
