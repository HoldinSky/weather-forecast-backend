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

const defaultConfig: SequelizeModuleOptions = {
  ...config().postgres,
  synchronize: true,
  autoLoadModels: true,
  models: [],
};

// const mongoUri: string = config().mongo.uri;
// const mongoOptions: MongooseModuleOptions = config().mongo.options;

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    SequelizeModule.forRoot(defaultConfig),
    // MongooseModule.forRoot(mongoUri, mongoOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
