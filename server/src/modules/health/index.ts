
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { HealthController } from './controller';

@Module({
    controllers: [HealthController]
})
export class HealthModule { }
