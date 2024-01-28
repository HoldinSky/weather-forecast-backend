import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  Table,
} from "sequelize-typescript";
import { Location } from "../../location/location.model";

interface DailyCreationAttr {
  time: Date;
  temperature_c: number;
  humidity: number;
  feels_like_c: number;
  precipitation_mm: number;
  snow_cm: number;
  pressure_mb: number;
  cloud_cover: number;
  wind_kph: number;
  wind_degree: number;
}

@Table({ tableName: "forecast_daily", createdAt: false, updatedAt: false })
export class DailyForecast extends Model<DailyForecast, DailyCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.DATEONLY,
    unique: true,
    allowNull: false,
    field: "date_",
  })
  date: Date;

  @Column({ type: DataType.FLOAT, allowNull: false })
  temperature_c: number;

  @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: 0 })
  humidity: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  feels_like_c: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  precipitation_mm: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  snow_cm: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 1000 })
  pressure_mb: number;

  @Column({ type: DataType.SMALLINT, allowNull: false })
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
