import { PositionType } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export type PositionCreateDto = {
  tokenPair: string;
  entryPrice: number;
  stoplossPrice: number;
  positionType: PositionType;
  margin: number;
  leverage: number;
};

export class PositionUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tokenPair: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  entryPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  stoplossPrice: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  positionType: PositionType;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  margin: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  leverage: number;
}

export type PositionVolumeCalculationDto = {
  entryPrice: number;
  stoplossPrice: number;
  totalPropertyAmount: number;
  maximumRisk: number;
};

export type MarginAndLeverageForNewTrade = {
  leverage: number;
  margin: number;
  tokenVol: number;
};

export type PositionCloseDto = {
  closePrice: number;
};
