import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { FilesService } from '../files/files.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movies.model';

@Injectable()
export class MoviesService {
  constructor (
    @InjectModel(Movie) private readonly movieModel: ModelType<Movie>,
    private readonly fileService: FilesService
  ) {}

  async getAll() {
    return this.movieModel.find();
  }

  async getById(id: string) {
    const movie = await this.movieModel.findById(id);

    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    return movie;
  }

  async create(dto: CreateMovieDto, file: any) {
    const filename = await this.fileService.save(file);
    const movie = new this.movieModel({...dto, image: filename});
    await movie.save();
    return movie;
  }

  async update(dto: Partial<CreateMovieDto> & {id: string}) {
    return this.movieModel.findByIdAndUpdate(dto.id, dto, {new: true}).exec();
  }

  async delete(id: string) {
    return this.movieModel.findByIdAndDelete(id).exec();
  }
}
