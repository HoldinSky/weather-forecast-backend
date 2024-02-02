import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Location } from "../database/location/location.model";
import { Coordinates, HAVERSINE_FORMULA, usedLocations } from "../../utils/helper";
import { OpenWeatherAPI } from "../API/open-weather";
import { Sequelize } from "sequelize-typescript";
import { Transaction } from "sequelize";


@Injectable()
export class LocationService {

  constructor(@InjectModel(Location) private locationRepository: typeof Location, private sequelize: Sequelize) {
  }

  async getAllLocations() {
    return this.locationRepository.findAll({ where: {} });
  }

  async setup() {
    for (const location of usedLocations) {
      const city = await OpenWeatherAPI.getCityInfo(location);

      if (!city || !city.lat || !city.lon) continue;

      await this.locationRepository.create({
        lat: city.lat,
        lon: city.lon,
        name: city.name,
        country: city.country
      });
    }
  }

  async fetchByCoordinates(coords: Coordinates, maxDist: number = 10, trx?: Transaction) {
    return this.locationRepository.findOne({
      where: this.sequelize.literal(`${HAVERSINE_FORMULA} <= :distance`),
      replacements: { lat: coords.lat, lon: coords.lon, distance: maxDist },
      transaction: trx
    });
  }

  async dangerouslyClearTable() {
    await this.locationRepository.destroy({ where: {} });
  }
}