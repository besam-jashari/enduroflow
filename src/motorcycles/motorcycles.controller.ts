import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { MotorcyclesService } from './motorcycles.service';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import { FindMotorcyclesQueryDto } from './dto/find-motorcycles-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('motorcycles')
@Controller('motorcycles')
export class MotorcyclesController {
  constructor(private readonly motorcyclesService: MotorcyclesService) {}

  // ─── Public routes ────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'Get all motorcycles',
    description:
      'Optional filters: search, minPrice, maxPrice, isAvailable, cc. Sort with sortBy (pricePerDay | brand | cc; default createdAt) and order (ASC | DESC; default DESC).',
  })
  @ApiResponse({ status: 200, description: 'List of motorcycles.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  findAll(@Query() query: FindMotorcyclesQueryDto) {
    return this.motorcyclesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a motorcycle by ID' })
  @ApiResponse({ status: 200, description: 'Motorcycle details.' })
  @ApiResponse({ status: 404, description: 'Motorcycle not found.' })
  findOne(@Param('id') id: string) {
    return this.motorcyclesService.findOne(id);
  }

  // ─── Admin-only routes ────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new motorcycle (Admin only)' })
  @ApiResponse({ status: 201, description: 'Motorcycle successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreateMotorcycleDto) {
    return this.motorcyclesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a motorcycle by ID (Admin only)' })
  @ApiBody({ type: CreateMotorcycleDto, description: 'Motorcycle update fields (all fields are optional)' })
  @ApiResponse({ status: 200, description: 'Motorcycle successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Motorcycle not found.' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateMotorcycleDto>) {
    return this.motorcyclesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a motorcycle by ID (Admin only)' })
  @ApiResponse({ status: 204, description: 'Motorcycle successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Motorcycle not found.' })
  remove(@Param('id') id: string) {
    return this.motorcyclesService.remove(id);
  }
}
