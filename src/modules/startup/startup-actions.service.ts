import { HttpException, Injectable } from "@nestjs/common";
import { Coordinates, PythonToDaily } from "../../utils/helper";
import { PythonResponse } from "../API/models";
import { Location } from "../database/location/location.model";
import { DailyDTO } from "../database/daily/daily.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Op } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";
import { PythonService } from "../python/python.service";
import { log } from "winston";
import { HourlyForecast } from "../database/hourly/hourly.model";
import { DailyForecast } from "../database/daily/daily.model";
import { Sequelize } from "sequelize-typescript";
import { LocationService } from "../location/location.service";

@Injectable()
export class StartupActions {

  constructor(@InjectModel(HourlyForecast)
              private hourlyRepository: typeof HourlyForecast,
              @InjectModel(DailyForecast)
              private dailyRepository: typeof DailyForecast,
              private locationService: LocationService,
              private pythonService: PythonService,
              private sequelize: Sequelize
  ) {
    this.setup().then(() => log({ level: "info", message: "Application startup is finished" }));
  }

  private async addHourlyForecastsInLocation(
    coords: Coordinates,
    responses: PythonResponse[]
  ) {
    const t = await this.sequelize.transaction();

    try {
      const location = await this.locationService.fetchByCoordinates(coords, 10);

      if (!location)
        throw new HttpException("Failed to find specified location", 400);

      for (const response of responses) {
        await this.hourlyRepository.create(
          {
            time: new Date(response.ds),
            temperature_c: response.temp_2,
            feels_like_c: response.temp_a,
            humidity: response.hum_2,
            precipitation_mm: response.precip,
            rain_mm: response.rain,
            pressure_mb: response.press,
            cloud_cover: response.cloud,
            wind_kph: response.w_speed,
            wind_degree: response.w_dir,
            location_id: location.id
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

  private async addDailyForecastInLocation(coords: Coordinates, forecast: DailyDTO) {
    const t = await this.sequelize.transaction();

    try {
      const location = await this.locationService.fetchByCoordinates(coords, 10);

      if (!location)
        throw new HttpException("Failed to find specified location", 400);

      await this.dailyRepository.create(
        {
          date: new Date(forecast.ds),
          temperature_min_c: forecast.temp_min_2,
          temperature_max_c: forecast.temp_max_2,
          humidity: forecast.hum_2,
          precipitation_mm: forecast.precip,
          rain_mm: forecast.rain,
          pressure_mb: forecast.press,
          cloud_cover: forecast.cloud,
          wind_kph: forecast.w_speed,
          wind_degree: forecast.w_dir,
          location_id: location.id
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
    const today = new Date();

    await this.dailyRepository.destroy({
      where: {
        date: {
          [Op.lt]: today
        }
      }
    });

    await this.hourlyRepository.destroy({
      where: {
        time: {
          [Op.lt]: today
        }
      }
    });

    const locations = (await this.locationService.getAllLocations()) as Location[];

    for (const location of locations) {
      const coords = { lat: location.lat, lon: location.lon };
      const response = await this.pythonService.fetchPredictForDays(coords, 2);

      await this.addHourlyForecastsInLocation(coords, response);
      while (response.length > 0) {
        const oneDay = response.slice(0, 24);
        response.splice(0, 24);

        await this.addDailyForecastInLocation(coords, PythonToDaily(oneDay));
      }
    }
  }

  private async setup() {
    await this.clearDb();

    await this.locationService.setup();
    await this.updateInfoInDatabase();
  }

  private async clearDb() {
    await this.dailyRepository.destroy({ where: {} });
    await this.hourlyRepository.destroy({ where: {} });
    await this.locationService.dangerouslyClearTable();
  }
}