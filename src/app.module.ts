import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import config from "config/config";
import { SequelizeModule, SequelizeModuleOptions } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AllExceptionsFilter } from "./utils/filters/all-exceptions.filter";
import { LoggingInterceptor } from "./utils/interceptors/logging.interceptor";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./services/winston/winston";
import { HourlyForecast } from "./modules/forecast/hourly/hourly.model";
import { ForecastModule } from "./modules/forecast/forecast.module";
import { Location } from "./modules/location/location.model";
import { DailyForecast } from "./modules/forecast/daily/daily.model";

const defaultConfig: SequelizeModuleOptions = {
  ...config().postgres,
  synchronize: true,
  autoLoadModels: true,
  models: [Location, DailyForecast, HourlyForecast]
};

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config]
    }),
    SequelizeModule.forRoot(defaultConfig),
    ForecastModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {
}
