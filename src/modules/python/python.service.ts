import { Injectable } from "@nestjs/common";
import axiosRequest from "../../services/apiClient/apiClient";
import { RequestMethods } from "../../services/apiClient/apiClient.dto";
import { Coordinates } from "../../utils/helper";
import { PythonResponse } from "../API/models";

@Injectable()
export class PythonService {
  private readonly predictUrl = "/predict";

  async fetchPredictForDays(coords: Coordinates, count: number) {
    const dateString = new Date(Date.now()).toISOString();

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

    return resp.response;
  }
}
