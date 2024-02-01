import { PythonResponse } from "../modules/API/python-response";
import { DailyDTO } from "../modules/database/daily/daily.dto";

export type Coordinates = { lat: number, lon: number, dist?: number };

export const MILLIS_IN_DAY = 24 * 60 * 60 * 1000;

export const minutesToMillis = (mins: number) => mins * 60 * 1000;

export const PythonToDaily = (responses: PythonResponse[]): DailyDTO => {
  let temp_min_2: number = responses[0].temp_2;
  let temp_max_2: number = responses[0].temp_2;
  let hum_2_total: number = 0;
  let precip_total: number = 0;
  let rain_total: number = 0;
  let press_total: number = 0;
  let cloud_total: number = 0;
  let w_speed_total: number = 0;
  let w_dir_total: number = 0;

  responses.forEach(r => {
    if (r.temp_2 > temp_max_2) temp_max_2 = r.temp_2;
    else if (r.temp_2 < temp_min_2) temp_min_2 = r.temp_2;

    hum_2_total += r.hum_2;
    precip_total += r.precip;
    rain_total += r.rain;
    press_total += r.press;
    cloud_total += r.cloud;
    w_speed_total += r.w_speed;
    w_dir_total += r.w_dir;
  });

  const count = responses.length;

  return {
    ds: responses[0].ds,
    temp_min_2,
    temp_max_2,
    hum_2: hum_2_total / count,
    precip: precip_total / count,
    rain: rain_total / count,
    press: press_total / count,
    cloud: cloud_total / count,
    w_speed: w_speed_total / count,
    w_dir: w_dir_total / count
  }
}