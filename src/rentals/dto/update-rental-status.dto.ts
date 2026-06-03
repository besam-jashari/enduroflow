import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRentalStatusDto {
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
  @IsNotEmpty()
  status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
