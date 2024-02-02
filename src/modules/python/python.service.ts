import { Injectable } from "@nestjs/common";
import axiosRequest from "../../services/apiClient/apiClient";
import { RequestMethods } from "../../services/apiClient/apiClient.dto";
import { Coordinates } from "../../utils/helper";
import { PythonResponse } from "../API/models";

@Injectable()
export class PythonService {
  private readonly predictUrl = "/predict";
  private readonly defaultPredictDays = 8;

  async fetchPredictForDays(coords: Coordinates, count: number = this.defaultPredictDays) {
    const dateString = new Date(Date.now()).toISOString();

    const response: PythonResponse[][] = [];
    const resp = await axiosRequest<undefined, { start_date: string }, PythonResponse[]>({
      url: this.predictUrl,
      method: RequestMethods.GET,
      params: {
        start_date: dateString.substring(0, dateString.indexOf("T")),
        latitude: coords.lat,
        longitude: coords.lon,
        periods: count * 24
      }
    });

    if (resp.response)
      response.push(resp.response);

    return response;
  }
}
