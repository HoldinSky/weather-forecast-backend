import { Injectable } from "@nestjs/common";
import { HourlyForecast } from "../database/hourly/hourly.model";
import { DailyForecast } from "../database/daily/daily.model";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { InjectModel } from "@nestjs/sequelize";
import { Coordinates, HAVERSINE_FORMULA, MILLIS_IN_DAY } from "../../utils/helper";

@Injectable()
export class ForecastService {
  constructor(
    @InjectModel(HourlyForecast)
    private hourlyRepository: typeof HourlyForecast,
    @InjectModel(DailyForecast)
    private dailyRepository: typeof DailyForecast,
    private sequelize: Sequelize
  ) {
  }

  async getDailyInLocation(
    day: Date,
    coords: Coordinates
  ): Promise<DailyForecast> {
    return this.dailyRepository.findOne({
      where: {
        date: day
      },
      include: [
        {
          association: "location",
          required: true,
          attributes: [
            [this.sequelize.literal(HAVERSINE_FORMULA), "distance"],
            "lat", "lon", "name"
          ],
          where: this.sequelize.literal(`${HAVERSINE_FORMULA} <= :distance`),
          order: this.sequelize.literal("distance")
        }
      ],
      replacements: { lat: coords.lat, lon: coords.lon, distance: coords.dist ?? 10 }
    });
  }

  async getHourlyInLocation(
    day: Date,
    coords: Coordinates
  ): Promise<HourlyForecast[]> {
    const next_day = new Date(day.getTime() + MILLIS_IN_DAY - 1);

    return this.hourlyRepository.findAll({
      where: {
        time: {
          [Op.between]: [day, next_day]
        }
      },
      include: [
        {
          association: "location",
          required: true,
          attributes: [
            [this.sequelize.literal(HAVERSINE_FORMULA), "distance"],
            "lat", "lon", "name"
          ],
          where: this.sequelize.literal(`${HAVERSINE_FORMULA} <= :distance`),
          order: this.sequelize.literal("distance")
        }
      ],
      replacements: { lat: coords.lat, lon: coords.lon, distance: coords.dist ?? 10 }
    });
  }
}
