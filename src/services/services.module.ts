import { Module } from "@nestjs/common";
import { Services } from "./services.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [Services],
    exports: [Services],
  })
  export class ServicesModule {}