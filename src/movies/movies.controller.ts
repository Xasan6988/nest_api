import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {

  constructor (
    private readonly moviesService: MoviesService,
    ) {}

  @Get()
  getAll() {
    return this.moviesService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.moviesService.getById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateMovieDto,
    @UploadedFile() file: any) {
    return this.moviesService.create(dto, file);
  }

  @Patch()
  update(
    @Body() dto: Partial<CreateMovieDto> & {id: string}
    ) {
    return this.moviesService.update(dto);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string
    ) {
    return this.moviesService.delete(id);
  }
}
