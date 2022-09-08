import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './reviews.model';


@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService
  ) {}

  @ApiOperation({summary: 'Get all reviews'})
  @ApiResponse({status: 200, type: [Review]})
  @Get()
  getAll() {
    return this.reviewsService.getAll();
  }


  @ApiOperation({summary: 'Get review by ID'})
  @ApiResponse({status: 200, type: Review})
  @Get(":id")
  getByMovieId(@Param('id') movieId: string) {
    return this.reviewsService.getByMovieId(movieId);
  }

  @ApiOperation({summary: 'Create new review'})
  @ApiResponse({status: 201, type: Review})
  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @ApiOperation({summary: 'Delete review by id'})
  @ApiResponse({status: 201, type: Review})
  @Delete(':id')
  delete(@Param('id') reviewId: string) {
    return this.reviewsService.delete(reviewId);
  }

}
