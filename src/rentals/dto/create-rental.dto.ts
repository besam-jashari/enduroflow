import { IsUUID, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateRentalDto {
  @IsUUID()
  @IsNotEmpty()
  motorcycleId!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;
}
