import * as dotenv from "dotenv";
import ConfigDTO from "./config.dto";

dotenv.config({ path: "./.env" });

const getConfig: () => ConfigDTO = () => ({
  node: {
    port: process.env.PORT,
    pythonServiceUrl: process.env.PYTHON_SERVICE_URL,
  },
  postgres: {
    dialect: "postgres",
    uri: process.env.POSTGRES_URL,
    define: {
      timestamps: false,
    },
    logging: false,
  },
  mongo: {
    uri: process.env.MONGO_URL,
    options: {},
  },
});

export default getConfig;
