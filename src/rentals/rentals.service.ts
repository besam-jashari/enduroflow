import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { Motorcycle } from '../motorcycles/entities/motorcycle.entity';
import { CreateRentalDto } from './dto/create-rental.dto';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    @InjectRepository(Motorcycle)
    private readonly motorcycleRepository: Repository<Motorcycle>,
  ) {}

  async create(dto: CreateRentalDto, userId: string): Promise<Rental> {
    const motorcycle = await this.motorcycleRepository.findOne({
      where: { id: dto.motorcycleId },
    });
    if (!motorcycle) {
      throw new NotFoundException(
        `Motorcycle with ID "${dto.motorcycleId}" not found`,
      );
    }

    if (!motorcycle.isAvailable) {
      throw new BadRequestException('Motorcycle is not available for rental');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid start or end date');
    }

    if (endDate < startDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    // Check for overlapping rentals (excluding cancelled ones)
    const overlapping = await this.rentalRepository.findOne({
      where: {
        motorcycle: { id: dto.motorcycleId },
        status: Not('cancelled' as any),
        startDate: LessThanOrEqual(endDate as any),
        endDate: MoreThanOrEqual(startDate as any),
      },
    });

    if (overlapping) {
      throw new ConflictException(
        'Motorcycle is already booked for the selected dates',
      );
    }

    // Calculate total price
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.max(
      1,
      Math.round((endDate.getTime() - startDate.getTime()) / msPerDay),
    );
    const totalPrice = diffDays * Number(motorcycle.pricePerDay);

    const rental = this.rentalRepository.create({
      startDate,
      endDate,
      totalPrice,
      status: 'pending',
      user: { id: userId } as any,
      motorcycle,
    });

    return this.rentalRepository.save(rental);
  }

  async findMyRentals(userId: string): Promise<Rental[]> {
    return this.rentalRepository.find({
      where: { user: { id: userId } },
      relations: { motorcycle: true },
    });
  }

  async findAll(search?: string): Promise<Rental[]> {
    const qb = this.rentalRepository.createQueryBuilder('rental')
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('rental.motorcycle', 'motorcycle');

    if (search?.trim()) {
      qb.where(
        '(motorcycle.brand ILIKE :search OR motorcycle.model ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search.trim()}%` }
      );
    }

    return qb.getMany();
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  ): Promise<Rental> {
    const rental = await this.rentalRepository.findOne({
      where: { id },
      relations: { motorcycle: true, user: true },
    });
    if (!rental) {
      throw new NotFoundException(`Rental with ID "${id}" not found`);
    }

    rental.status = status;
    return this.rentalRepository.save(rental);
  }
}
