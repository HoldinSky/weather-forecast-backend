import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { HourlyForecast } from "./hourly/hourly.model";
import { Location } from "../location/location.model";
import { DailyForecast } from "./daily/daily.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    SequelizeModule.forFeature([Location, DailyForecast, HourlyForecast]),
  ],
  exports: [],
})
export class ForecastModule {
  constructor() {
    DailyForecast.drop();
    HourlyForecast.drop();
    Location.drop();
  }
}
