import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  Table
} from "sequelize-typescript";
import { Location } from "../location/location.model";
import { minutesToMillis } from "../../../utils/helper";

interface HourlyCreationAttr {
  time: Date;
  temperature_c: number;
  humidity: number;
  feels_like_c: number;
  precipitation_mm: number;
  rain_mm: number;
  pressure_mb: number;
  cloud_cover: number;
  wind_kph: number;
  wind_degree: number;
  location_id: number;
}

@Table({ tableName: "forecast_hourly", createdAt: false, updatedAt: false })
export class HourlyForecast extends Model<HourlyForecast, HourlyCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.DATE, unique: false, allowNull: false })
  time: Date;

  @Column({ type: DataType.FLOAT, allowNull: false })
  temperature_c: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  humidity: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  feels_like_c: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  precipitation_mm: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  rain_mm: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 1000 })
  pressure_mb: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  cloud_cover: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  wind_kph: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  wind_degree: number;

  @Index
  @ForeignKey(() => Location)
  @Column({ type: DataType.INTEGER, allowNull: false })
  location_id: number;

  @BelongsTo(() => Location, { foreignKey: "location_id" })
  location: Location;


  @BeforeCreate
  @BeforeUpdate
  static adjustTimeZone(instance: HourlyForecast) {
    if (instance.time) {
      instance.time = new Date(instance.time.getTime() - minutesToMillis(instance.time.getTimezoneOffset()));
    }
  }
}
