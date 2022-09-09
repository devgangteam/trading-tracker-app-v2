import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from 'src/authz/types';
import {
  PositionCloseDto,
  PositionCreateDto,
  PositionUpdateDto,
} from './positions.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get('open')
  async getOpenPositions(@Req() { user }: RequestWithUser) {
    return await this.positionsService.getOpenPositions(user.id);
  }

  @Get('closed')
  async getClosedPositions(
    @Req() { user }: RequestWithUser,
    @Query('size') size: number,
  ) {
    return await this.positionsService.getClosedPositions(user.id, +size);
  }

  @Post()
  async createPosition(
    @Req() { user }: RequestWithUser,
    @Body() positionCreationDto: PositionCreateDto,
  ) {
    await this.positionsService.createPosition(user.id, positionCreationDto);
  }

  @Patch(':id')
  async updatePosition(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
    @Body() position: PositionUpdateDto,
  ) {
    return this.positionsService.updatePosition(user.id, id, position);
  }

  @Delete(':id')
  async deletePosition(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
  ) {
    return this.positionsService.deletePosition(user.id, id);
  }

  @Post(':id/close')
  async closePosition(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
    @Body() positionCloseDto: PositionCloseDto,
  ) {
    return this.positionsService.closePosition(user.id, id, positionCloseDto);
  }
}
