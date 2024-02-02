import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "../../app.controller";
import { AppService } from "../../app.service";
import { StartupActions } from "./startup-actions.service";
import { HourlyForecast } from "../database/hourly/hourly.model";
import { DailyForecast } from "../database/daily/daily.model";
import { LocationService } from "../location/location.service";
import { PythonService } from "../python/python.service";

describe("StartupActionsService", () => {
  let startupActions: StartupActions


});