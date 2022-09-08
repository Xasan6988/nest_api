import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './configs/mongo.config';
import { MoviesModule } from './movies/movies.module';
import { FilesModule } from './files/files.module';
import { ReviewsModule } from './reviews/reviews.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    MoviesModule,
    FilesModule,
    ReviewsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
