import { Controller, Get, HttpException, Query } from "@nestjs/common";
import { ForecastService } from "./forecast.service";
import { minutesToMillis } from "../../utils/helper";
import { LocationService } from "../location/location.service";

@Controller("/forecast")
export class ForecastController {
  constructor(
    private forecastService: ForecastService,
    private locationService: LocationService
  ) {
  }

  @Get("/daily")
  getForDayInLocation(
    @Query("lat") lat: number,
    @Query("lon") lon: number,
    @Query("day") day: string,
    @Query("maxDist") dist: number
  ) {
    if (!day) {
      throw new HttpException(
        "Date must be specified. Set 'day' parameter in format yyyy-MM-dd",
        400
      );
    }

    const date = new Date(day);
    const dateWithoutOffset = new Date(date.getTime() - minutesToMillis(date.getTimezoneOffset()));

    return this.forecastService.getDailyInLocation(dateWithoutOffset, { lat, lon, dist });
  }

  @Get("/hourly")
  getForHoursInLocation(
    @Query("lat") lat: number,
    @Query("lon") lon: number,
    @Query("day") day: string,
    @Query("maxDist") dist: number
  ) {
    if (!day) {
      throw new HttpException(
        "Date must be specified. Set 'day' parameter in format yyyy-MM-dd",
        400
      );
    }

    const date = new Date(day);
    const dateWithoutOffset = new Date(date.getTime() - minutesToMillis(date.getTimezoneOffset()));

    return this.forecastService.getHourlyInLocation(dateWithoutOffset, { lat, lon, dist });
  }

  @Get("/available-locations")
  getAllLocations() {
    return this.locationService.getAllLocations();
  }
}
