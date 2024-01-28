import { Controller, Get, HttpException, Param, Query } from "@nestjs/common";
import { ForecastService } from "./forecast.service";

@Controller("/forecast")
export class ForecastController {
  constructor(private forecastService: ForecastService) {}

  @Get("/day/:date")
  getForDayInLocation(
    @Param("date") date: Date,
    @Query("lat") lat: number,
    @Query("lon") lon: number,
  ) {
    if (!lat || !lon) {
      throw new HttpException(
        "Location must be specified. Set 'lat' parameter to wanted latitude and 'lon' to respective longitude",
        400,
      );
    }
    return this.forecastService.getForDayInLocation(date, { lat, lon });
  }
}
