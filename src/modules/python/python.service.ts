import { Injectable } from "@nestjs/common";
import axiosRequest from "../../services/apiClient/apiClient";
import { RequestMethods } from "../../services/apiClient/apiClient.dto";
import { Coordinates, MILLIS_IN_DAY } from "../../utils/helper";
import { PythonResponse } from "../API/models";

@Injectable()
export class PythonService {
  private readonly predictUrl = "/predict";
  private readonly defaultPredictDays = 8;

  async fetchPredictForDays(coords: Coordinates, count: number = this.defaultPredictDays) {
    const days: string[] = [];

    for (let i = 0; i <= count; i++) {
      const dateString = new Date(Date.now() + i * MILLIS_IN_DAY).toISOString();
      days.push(dateString.substring(0, dateString.indexOf("T")));
    }

    const response: PythonResponse[][] = [];
    for (const day of days) {
      const resp = await axiosRequest<undefined, { start_date: string }, PythonResponse[]>({
        url: this.predictUrl,
        method: RequestMethods.GET,
        params: { start_date: day, latitude: coords.lat, longitude: coords.lon }
      });

      if (resp.response)
        response.push(resp.response);
    }

    return response;
  }
}
