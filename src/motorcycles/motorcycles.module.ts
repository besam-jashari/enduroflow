import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Motorcycle } from './entities/motorcycle.entity';
import { MotorcyclesService } from './motorcycles.service';
import { MotorcyclesController } from './motorcycles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Motorcycle])],
  controllers: [MotorcyclesController],
  providers: [MotorcyclesService],
  exports: [MotorcyclesService],
})
export class MotorcyclesModule {}
