import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { HourlyForecast } from "../hourly/hourly.model";
import { DailyForecast } from "../daily/daily.model";

export interface LocationCreationAttr {
  lat: number;
  lon: number;
  name: string;
  country: string;
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

  @Column({ type: DataType.FLOAT, unique: true, allowNull: false })
  lat: number;

  @Column({ type: DataType.FLOAT, unique: true, allowNull: false })
  lon: number;

  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, unique: false, allowNull: false })
  country: string;

  @HasMany(() => HourlyForecast, { onDelete: "SET NULL" })
  hourly_forecasts: HourlyForecast[];

  @HasMany(() => DailyForecast, { onDelete: "SET NULL" })
  daily_forecasts: DailyForecast[];
}
