import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { FilesModule } from '../files/files.module';
import { Review } from '../reviews/reviews.model';
import { MoviesController } from './movies.controller';
import { Movie } from './movies.model';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: Movie,
        schemaOptions: {
          collection: 'movies'
        }
      },
      {
        typegooseClass: Review,
        schemaOptions: {
          collection: 'reviews'
        }
      },
    ]),
    FilesModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class MoviesModule {}
