import { Controller, Get, HttpException, Param, Query } from "@nestjs/common";
import { ForecastService } from "./forecast.service";
import { PythonService } from "../python/python.service";

@Controller("/forecast")
export class ForecastController {
  constructor(
    private forecastService: ForecastService,
    private pythonService: PythonService,
  ) {}

  @Get("/daily/:location")
  getForDayInLocation(
    @Param("location") location: string,
    @Query("day") day: Date,
  ) {
    if (!day) {
      throw new HttpException(
        "Date must be specified. Set 'day' parameter in format yyyy-MM-dd",
        400,
      );
    }

    return this.forecastService.getDailyInLocation(day, location);
  }

  @Get("/hourly/:location")
  getForHoursInLocation(
    @Param("location") location: string,
    @Query("day") day: Date,
  ) {
    if (!day) {
      throw new HttpException(
        "Date must be specified. Set 'day' parameter in format yyyy-MM-dd",
        400,
      );
    }

    return this.forecastService.getHourlyInLocation(day, location);
  }
}
