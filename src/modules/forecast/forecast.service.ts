import { HttpException, Injectable } from "@nestjs/common";
import { HourlyForecast } from "./hourly/hourly.model";
import { DailyForecast } from "./daily/daily.model";
import { Location } from "../location/location.model";
import { HourlyDTO } from "./hourly/hourly.dto";
import { DailyDTO } from "./daily/daily.dto";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { InjectModel } from "@nestjs/sequelize";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class ForecastService {
  constructor(
    @InjectModel(HourlyForecast)
    private hourlyRepository: typeof HourlyForecast,
    @InjectModel(DailyForecast)
    private dailyRepository: typeof DailyForecast,
    @InjectModel(Location)
    private locationRepository: typeof Location,
    private sequelize: Sequelize
  ) {
    // this.updateInfoInDatabase();
  }

  async getDailyInLocation(
    day: Date,
    location_name: string
  ): Promise<DailyForecast> {
    return this.dailyRepository.findOne({
      where: {
        date: day
      },
      include: [
        {
          association: "location",
          required: true,
          where: { name: location_name },
          attributes: ["lat", "lon", "name"]
        }
      ]
    });
  }

  async getHourlyInLocation(
    day: Date,
    location_name: string
  ): Promise<HourlyForecast[]> {
    const next_day = new Date(day.getTime() + 1 * 24 * 60 * 60 * 1000 - 1);

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
          where: { name: location_name },
          attributes: ["lat", "lon", "name"]
        }
      ]
    });
  }

  async addHourlyForecastsInLocation(
    location_name: string,
    forecasts: HourlyDTO[]
  ) {
    const t = await this.sequelize.transaction();

    try {
      const location = (await this.locationRepository.findOne({
        where: {
          name: location_name
        },
        transaction: t
      })) as Location;

      if (!location)
        throw new HttpException("Failed to find specified location", 400);

      for (const fr of forecasts) {
        await this.hourlyRepository.create(
          {
            time: new Date(fr.ds),
            temperature_c: fr.temp_2,
            feels_like_c: fr.temp_a,
            humidity: fr.hum_2,
            precipitation_mm: fr.precip,
            rain_mm: fr.rain,
            pressure_mb: fr.press,
            cloud_cover: fr.cloud,
            wind_kph: fr.w_speed,
            wind_degree: fr.w_dir
          },
          { transaction: t }
        );
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async addDailyForecastInLocation(location_name: string, forecast: DailyDTO) {
    const t = await this.sequelize.transaction();

    try {
      const location = (await this.locationRepository.findOne({
        where: {
          name: location_name
        },
        transaction: t
      })) as Location;

      if (!location)
        throw new HttpException("Failed to find specified location", 400);

      await this.dailyRepository.create(
        {
          time: new Date(forecast.ds),
          temperature_min_c: forecast.temp_min_2,
          temperature_max_c: forecast.temp_max_2,
          humidity: forecast.hum_2,
          precipitation_mm: forecast.precip,
          rain_mm: forecast.rain,
          pressure_mb: forecast.press,
          cloud_cover: forecast.cloud,
          wind_kph: forecast.w_speed,
          wind_degree: forecast.w_dir
        },
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async updateInfoInDatabase() {
    const now = Date.now();

    await this.dailyRepository.destroy({
      where: {
        date: {
          [Op.lt]: now
        }
      }
    });

    await this.hourlyRepository.destroy({
      where: {
        time: {
          [Op.lt]: now
        }
      }
    });
  }
}
