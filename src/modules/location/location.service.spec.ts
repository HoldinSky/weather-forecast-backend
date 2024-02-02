import { LocationService } from "./location.service";
import { Sequelize } from "sequelize-typescript";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/sequelize";
import { usedLocations } from "../../utils/helper";
import { Location } from "../database/location/location.model";
import { OpenWeatherAPI } from "../API/open-weather";
import { QueryTypes } from "sequelize";
import { DailyForecast } from "../database/daily/daily.model";
import { HourlyForecast } from "../database/hourly/hourly.model";

describe("LocationService", () => {
  let locationService: LocationService;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getModelToken(Location),
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            destroy: jest.fn()
          }
        },
        {
          provide: Sequelize,
          useValue: {}
        }
      ]
    }).compile();

    locationService = module.get<LocationService>(LocationService);

    sequelize = new Sequelize({
      dialect: "postgres",
      username: "developer",
      password: process.env.POSTGRES_PASSWORD,
      database: "forecast",
      host: "localhost",
      port: 5432
    });

    sequelize.addModels([HourlyForecast, DailyForecast, Location]);
  });

  describe("openWeatherAPI", () => {
    it("should return info about city", async () => {
      let city = await OpenWeatherAPI.getCityInfo("Kyiv");
      expect(city).toHaveProperty("name", "Kyiv");
      expect(city).toHaveProperty("country", "UA");
      expect(city).toHaveProperty("lat", 50.4500336);
      expect(city).toHaveProperty("lon", 30.5241361);

      city = await OpenWeatherAPI.getCityInfo("Lviv");
      expect(city).toHaveProperty("name", "Lviv");
      expect(city).toHaveProperty("country", "UA");
      expect(city).toHaveProperty("lat", 49.841952);
      expect(city).toHaveProperty("lon", 24.0315921);
    });
  });

  describe("setup", () => {
    it("should create locations from OpenWeatherAPI", async () => {
      await locationService.setup();

      const res: { name: string }[] = await sequelize.query("SELECT name FROM location;", { type: QueryTypes.SELECT });

      expect(res.map(r => r.name)).toEqual(usedLocations);
    });
  });
});