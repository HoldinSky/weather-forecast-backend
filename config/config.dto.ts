import { SequelizeModuleOptions } from "@nestjs/sequelize";

interface NodeConfig {
  port: string;
  pythonServiceUrl: string;
}

export default interface ConfigDTO {
  node: NodeConfig;
  postgres: SequelizeModuleOptions;
}
