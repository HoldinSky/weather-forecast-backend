import * as dotenv from "dotenv";
import ConfigDTO from "./config.dto";

dotenv.config({ path: ".env" });

const getConfig: () => ConfigDTO = () => {
  const env = process.env;

  return {
    node: {
      port: env.PORT,
      pythonServiceUrl: env.PYTHON_SERVICE_URL,
      openWeatherApiKey: env.OPEN_WEATHER_API_KEY
    },
    postgres: {
      dialect: "postgres",
      uri: `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST || "127.0.0.1"}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
      define: {
        timestamps: false
      },
      logging: false
    }
  };
};

export default getConfig;
