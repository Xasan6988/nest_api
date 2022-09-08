import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Review } from './reviews.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: Review,
        schemaOptions: {
          collection: 'reviews'
        }
      }
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
