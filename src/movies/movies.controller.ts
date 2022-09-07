import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movies.model';
import { MoviesService } from './movies.service';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {

  constructor (
    private readonly moviesService: MoviesService,
    ) {}

  @ApiOperation({summary: 'Get all movies'})
  @ApiResponse({status: 200, type: [Movie]})
  @Get()
  getAll() {
    return this.moviesService.getAll();
  }

  @ApiOperation({summary: 'Get movie by ID'})
  @ApiResponse({status: 200, type: Movie})
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.moviesService.getById(id);
  }

  @ApiOperation({summary: 'Create new movie'})
  @ApiResponse({status: 201, type: Movie})
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateMovieDto,
    @UploadedFile() file: any
    ) {
    return this.moviesService.create(dto, file);
  }

  @ApiOperation({summary: 'Update existing movie'})
  @ApiResponse({status: 201, type: Movie})
  @Patch()
  update(
    @Body() dto: Partial<CreateMovieDto> & {id: string}
    ) {
    return this.moviesService.update(dto);
  }

  @ApiOperation({summary: 'Delete existing movie'})
  @ApiResponse({status: 201, type: Movie})
  @Delete(':id')
  delete(
    @Param('id') id: string
    ) {
    return this.moviesService.delete(id);
  }

  @Post('/search')
  search(@Body('search') search: string) {
    return this.moviesService.search(search);
  }
}
