import { Module } from "@nestjs/common";
import { PythonService } from "./python.service";

@Module({
  controllers: [],
  providers: [PythonService],
  imports: [],
  exports: [PythonService]
})
export class PythonModule {
  constructor() {
  }
}
