import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Motorcycle } from '../motorcycles/entities/motorcycle.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Motorcycle)
    private readonly motorcycleRepository: Repository<Motorcycle>,
  ) {}

  async create(dto: CreateReviewDto, userId: string): Promise<Review> {
    const motorcycle = await this.motorcycleRepository.findOne({
      where: { id: dto.motorcycleId },
    });
    if (!motorcycle) {
      throw new NotFoundException(
        `Motorcycle with ID "${dto.motorcycleId}" not found`,
      );
    }

    const review = this.reviewRepository.create({
      rating: dto.rating,
      comment: dto.comment,
      user: { id: userId } as any,
      motorcycle,
    });

    return this.reviewRepository.save(review);
  }

  async findByMotorcycle(motorcycleId: string): Promise<Review[]> {
    const motorcycle = await this.motorcycleRepository.findOne({
      where: { id: motorcycleId },
    });
    if (!motorcycle) {
      throw new NotFoundException(
        `Motorcycle with ID "${motorcycleId}" not found`,
      );
    }

    return this.reviewRepository.find({
      where: { motorcycle: { id: motorcycleId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }
}
