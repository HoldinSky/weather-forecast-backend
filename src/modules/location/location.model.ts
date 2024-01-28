import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { HourlyForecast } from "../forecasts/hourly/hourly.model";
import { DailyForecast } from "../forecasts/daily/daily.model";

interface LocationCreationAttr {
  lat: number;
  lon: number;
}

@Table({
  tableName: "location",
  createdAt: false,
  updatedAt: false,
})
export class Location extends Model<Location, LocationCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.FLOAT, unique: true, allowNull: false })
  lat: number;

  @Column({ type: DataType.FLOAT, unique: true, allowNull: false })
  lon: number;

  @HasMany(() => HourlyForecast, { onDelete: "SET NULL" })
  hourly_forecasts: HourlyForecast[];

  @HasMany(() => DailyForecast, { onDelete: "SET NULL" })
  daily_forecasts: DailyForecast[];
}
