import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { HourlyForecast } from "../forecast/hourly/hourly.model";
import { DailyForecast } from "../forecast/daily/daily.model";

interface LocationCreationAttr {
  lat: number;
  lon: number;
  name: string;
}

@Table({
  tableName: "location",
  createdAt: false,
  updatedAt: false
})
export class Location extends Model<Location, LocationCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.DECIMAL(8, 6), unique: true, allowNull: false })
  lat: number;

  @Column({ type: DataType.DECIMAL(9, 6), unique: true, allowNull: false })
  lon: number;

  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  name: string;

  @HasMany(() => HourlyForecast, { onDelete: "SET NULL" })
  hourly_forecasts: HourlyForecast[];

  @HasMany(() => DailyForecast, { onDelete: "SET NULL" })
  daily_forecasts: DailyForecast[];
}
