import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit a new review for a motorcycle' })
  @ApiResponse({ status: 201, description: 'Review successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() dto: CreateReviewDto, @Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.reviewsService.create(dto, userId);
  }

  @Get('motorcycles/:id/reviews')
  @ApiOperation({ summary: 'Get all reviews for a specific motorcycle' })
  @ApiResponse({ status: 200, description: 'List of reviews for the motorcycle.' })
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
