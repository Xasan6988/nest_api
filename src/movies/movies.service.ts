import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { FilesService } from '../files/files.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movies.model';
import { Review } from 'src/reviews/reviews.model';

@Injectable()
export class MoviesService {
  constructor (
    @InjectModel(Movie) private readonly movieModel: ModelType<Movie>,
    @InjectModel(Review) private readonly reviewModel: ModelType<Review>,
    private readonly fileService: FilesService
  ) {}

  async getAll() {
    return this.movieModel.find();
  }

  async getById(id: string) {
    // const objectId = new mongoose.Types.ObjectId(id);
    const movie = await this.movieModel.findById(id);
    const reviews = await this.reviewModel.find({movieId: id});
    const reviewsCount = reviews.length;
    const reviewsAvg = (reviews.reduce((sum, rating) => {
      return sum += rating.rating;
    }, 0) / reviews.length);

    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    return {movie, reviews, reviewsCount, reviewsAvg};
  }

  async create(dto: CreateMovieDto, file: any) {
    const filename = await this.fileService.save(file);
    const movie = new this.movieModel({...dto, image: filename});
    await movie.save();
    return movie;
  }

  async update(dto: Partial<CreateMovieDto> & {id: string}) {
    const updated = await this.movieModel.findByIdAndUpdate(dto.id, dto, {new: true}).exec();
    if (! updated) {
      throw new NotFoundException('Movie not found');
    }
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.movieModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Movie not found');
    }

    return deleted;
  }

  async search(search: string) {
    const searched = await this.movieModel.find({$text: {$search: search, $caseSensitive: false}}).exec();

    if (!searched.length) {
      throw new NotFoundException('Searched movie not found');
    }

    return searched;
  }
}
