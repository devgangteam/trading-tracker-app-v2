import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Get } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { Public } from "../auth/decorators/public";

@Controller('health')
export class HealthController {
  constructor() {}

  @Get()
  check(): string {
    return "OK";
  }

  @Get("public")
  @Public()
  checkPublic(): string {
    return "OK";
  }

}
