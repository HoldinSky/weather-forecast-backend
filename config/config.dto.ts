import { SequelizeModuleOptions } from "@nestjs/sequelize";

interface NodeConfig {
  port: string;
  pythonServiceUrl: string;
  openWeatherApiKey: string
}

export default interface ConfigDTO {
  node: NodeConfig;
  postgres: SequelizeModuleOptions;
}
