import { Module } from '@nestjs/common';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import { FilesModule } from 'src/files/files.module';
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
      }
    ]),
    FilesModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class MoviesModule {}
