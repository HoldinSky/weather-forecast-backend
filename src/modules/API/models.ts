export interface City {
  name: string,
  lat: number,
  lon: number,
  country: string,
  local_names: any
}

export interface PythonResponse {
  ds: string;
  temp_2: number;
  hum_2: number;
  temp_a: number;
  precip: number;
  rain: number;
  press: number;
  cloud: number;
  w_speed: number;
  w_dir: number;
}