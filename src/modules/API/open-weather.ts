import { Injectable } from "@nestjs/common";
import { City } from "./models";
import axios from "axios";
import { HttpException } from "@nestjs/common/exceptions";
import getConfig from "../../../config/config";

@Injectable()
export class OpenWeatherAPI {
  private static BASE_URL = "http://api.openweathermap.org/geo/1.0/direct";
  private static API_KEY = getConfig().node.openWeatherApiKey;

  static async getCityInfo(city: string): Promise<City> {
    const result = await axios<City>({
      method: "GET",
      url: `${OpenWeatherAPI.BASE_URL}?q=${city}&limit=1&appid=${OpenWeatherAPI.API_KEY}`
    });

    if (result.status !== 200) {
      throw new HttpException(result.statusText, result.status);
    }

    return result.data[0];
  }
}