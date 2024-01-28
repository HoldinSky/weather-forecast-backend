import { Injectable } from "@nestjs/common";
import { HourlyForecast } from "./hourly/hourly.model";
import { InjectModel } from "@nestjs/sequelize";
import { DailyForecast } from "./daily/daily.model";
import { Location } from "../location/location.model";

@Injectable()
export class ForecastService {
  constructor(
    @InjectModel(HourlyForecast)
    private hourlyRepository: typeof HourlyForecast,
    @InjectModel(DailyForecast)
    private dailyRepository: typeof DailyForecast,
    @InjectModel(Location) locationRepository: typeof Location,
  ) {}

  async getForDayInLocation(
    date: Date,
    location: { lat: number; lon: number },
  ): Promise<DailyForecast> {
    return this.dailyRepository.findOne({
      where: {
        date: date,
      },
      include: [
        {
          association: "location",
          required: true,
          where: { lat: location.lat, lon: location.lon },
          attributes: ["lat", "lon", "name"],
        },
      ],
    });
  }
}
