import { HttpException, Injectable } from "@nestjs/common";
import { HourlyForecast } from "./hourly/hourly.model";
import { DailyForecast } from "./daily/daily.model";
import { Location } from "../location/location.model";
import { DailyDTO } from "./daily/daily.dto";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { InjectModel } from "@nestjs/sequelize";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PythonService } from "../python/python.service";
import { MILLIS_IN_DAY } from "../../utils/constants";
import { PythonResponseDTO } from "../python/python-response.dto";

@Injectable()
export class ForecastService {
  constructor(
    @InjectModel(HourlyForecast)
    private hourlyRepository: typeof HourlyForecast,
    @InjectModel(DailyForecast)
    private dailyRepository: typeof DailyForecast,
    @InjectModel(Location)
    private locationRepository: typeof Location,
    private pythonService: PythonService,
    private sequelize: Sequelize
  ) {
    this.setup();
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
          where: { name: location_name },
          attributes: ["lat", "lon", "name"]
        }
      ]
    });
  }

  async addHourlyForecastsInLocation(
    location_name: string,
    responses: PythonResponseDTO[]
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

      for (const response of responses) {
        await this.hourlyRepository.create(
          {
            time: response.ds,
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
          date: forecast.ds,
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

  private async setupLocations() {
    // const location = await this.locationRepository.findOne({ where: { name: "Kyiv" } });
    // if (location) return Promise.resolve();

    await this.locationRepository.create({ lat: 50.439365, lon: 30.476192, name: "Kyiv" });
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
  }

  private async setup() {
    await this.clearDb();

    await this.setupLocations();
    await this.updateInfoInDatabase();

    this.pythonService.fetchPredictForDays().then(
      async (responses) => {
        for (const response of responses) {
          await this.addHourlyForecastsInLocation("Kyiv", response);
        }
      }
    );
  }

  private async clearDb() {
    await this.dailyRepository.destroy({ where: {} });
    await this.hourlyRepository.destroy({ where: {} });
    await this.locationRepository.destroy({ where: {} });
  }
}
