import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  Table
} from "sequelize-typescript";
import { Location } from "../location/location.model";

interface DailyCreationAttr {
  date: Date;
  temperature_min_c: number;
  temperature_max_c: number;
  humidity: number;
  precipitation_mm: number;
  rain_mm: number;
  pressure_mb: number;
  cloud_cover: number;
  wind_kph: number;
  wind_degree: number;
  location_id: number;
}

@Table({ tableName: "forecast_daily", createdAt: false, updatedAt: false })
export class DailyForecast extends Model<DailyForecast, DailyCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.DATEONLY,
    unique: false,
    allowNull: false,
    field: "date_"
  })
  date: Date;

  @Column({ type: DataType.FLOAT, allowNull: false })
  temperature_min_c: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  temperature_max_c: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  humidity: number;

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
}
