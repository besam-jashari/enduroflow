import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateReviewDto, @Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.reviewsService.create(dto, userId);
  }

  @Get('motorcycles/:id/reviews')
  async findByMotorcycle(@Param('id') id: string) {
    const reviews = await this.reviewsService.findByMotorcycle(id);
    return reviews.map((r) => ({
      firstName: r.user.firstName,
      lastName: r.user.lastName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));
  }
}
