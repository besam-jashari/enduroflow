import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motorcycle } from './entities/motorcycle.entity';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import {
  FindMotorcyclesQueryDto,
  SortOrder,
} from './dto/find-motorcycles-query.dto';

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

  async findAll(query: FindMotorcyclesQueryDto = {}): Promise<Motorcycle[]> {
    const qb = this.motorcycleRepository.createQueryBuilder('motorcycle');

    if (query.search?.trim()) {
      qb.andWhere(
        '(motorcycle.brand ILIKE :search OR motorcycle.model ILIKE :search)',
        { search: `%${query.search.trim()}%` },
      );
    }

    if (query.brand?.trim()) {
      qb.andWhere('motorcycle.brand ILIKE :brand', {
        brand: query.brand.trim(),
      });
    }

    if (query.minPrice !== undefined) {
      qb.andWhere('motorcycle.pricePerDay >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice !== undefined) {
      qb.andWhere('motorcycle.pricePerDay <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    if (query.isAvailable !== undefined) {
      qb.andWhere('motorcycle.isAvailable = :isAvailable', {
        isAvailable: query.isAvailable,
      });
    }

    if (query.cc !== undefined) {
      qb.andWhere('motorcycle.cc = :cc', { cc: query.cc });
    }

    const sortField = query.sortBy ?? 'createdAt';
    const sortOrder = query.order ?? SortOrder.DESC;

    qb.orderBy(`motorcycle.${sortField}`, sortOrder);

    return qb.getMany();
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
