import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum MotorcycleSortField {
  PRICE_PER_DAY = 'pricePerDay',
  BRAND = 'brand',
  CC = 'cc',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FindMotorcyclesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(50)
  cc?: number;

  @IsOptional()
  @IsEnum(MotorcycleSortField)
  sortBy?: MotorcycleSortField;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
