import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorcycle } from './entities/motorcycle.entity';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';

@Injectable()
export class MotorcyclesService {
  constructor(
    @InjectRepository(Motorcycle)
    private readonly motorcycleRepository: Repository<Motorcycle>,
  ) {}

  async create(dto: CreateMotorcycleDto): Promise<Motorcycle> {
    const motorcycle = this.motorcycleRepository.create(dto);
    return this.motorcycleRepository.save(motorcycle);
  }

  async findAll(): Promise<Motorcycle[]> {
    return this.motorcycleRepository.find();
  }

  async findOne(id: string): Promise<Motorcycle> {
    const motorcycle = await this.motorcycleRepository.findOne({
      where: { id },
    });
    if (!motorcycle) {
      throw new NotFoundException(`Motorcycle with id "${id}" not found`);
    }
    return motorcycle;
  }

  async update(
    id: string,
    dto: Partial<CreateMotorcycleDto>,
  ): Promise<Motorcycle> {
    const motorcycle = await this.findOne(id);
    Object.assign(motorcycle, dto);
    return this.motorcycleRepository.save(motorcycle);
  }

  async remove(id: string): Promise<void> {
    const motorcycle = await this.findOne(id);
    await this.motorcycleRepository.remove(motorcycle);
  }
}
