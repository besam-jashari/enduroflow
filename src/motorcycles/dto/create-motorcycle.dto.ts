import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateMotorcycleDto {
  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsInt()
  @Min(50)
  cc!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerDay!: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
