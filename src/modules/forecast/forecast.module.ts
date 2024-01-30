import { Module } from "@nestjs/common";
import { HourlyForecast } from "./hourly/hourly.model";
import { Location } from "../location/location.model";
import { DailyForecast } from "./daily/daily.model";
import { ForecastController } from "./forecast.controller";
import { ForecastService } from "./forecast.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { PythonService } from "../python/python.service";

@Module({
  controllers: [ForecastController],
  providers: [ForecastService, PythonService],
  imports: [
    SequelizeModule.forFeature([Location, DailyForecast, HourlyForecast])
  ],
  exports: []
})
export class ForecastModule {
}
