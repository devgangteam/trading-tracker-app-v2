import { CacheKey, CacheTTL, Controller, Get, Query } from '@nestjs/common';
import { BinanceService } from './binance.service';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('coins')
  @CacheKey('coins')
  @CacheTTL(86400)
  async getCoins(@Query('feature') feature: string) {
    return await this.binanceService.fetchCoinsFromBinance(feature);
  }
}
