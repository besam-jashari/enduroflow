import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalStatusDto } from './dto/update-rental-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('rentals')
@ApiBearerAuth('JWT-auth')
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new rental booking' })
  @ApiResponse({ status: 201, description: 'Rental booking successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateRentalDto, @Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.rentalsService.create(dto, userId);
  }

  @Get('my-rentals')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user rentals' })
  @ApiResponse({ status: 200, description: 'List of rentals for logged-in user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findMyRentals(@Request() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.rentalsService.findMyRentals(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all rentals (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all rentals.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query('search') search?: string) {
    return this.rentalsService.findAll(search);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update rental status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Rental status successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Rental not found.' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRentalStatusDto) {
    return this.rentalsService.updateStatus(id, dto.status);
  }
}
