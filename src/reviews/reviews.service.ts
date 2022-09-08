import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './reviews.model';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectModel(Review) private readonly reviewModel: ModelType<Review>
  ) {}

  async getAll() {
    const reviews = await this.reviewModel.find();

    if (!reviews.length) {
      throw new NotFoundException('Reviews not found');
    }

  }

  async getByMovieId(movieId: string) {
    const reviews = await this.reviewModel.find({movieId});

    if (!reviews.length) {
      throw new NotFoundException('Reviews not found');
    }

    return reviews;
  }

  async create(dto: CreateReviewDto) {
    const review = new this.reviewModel(dto);
    await review.save();

    return review;
  }

  async delete(id: string) {
    const deleted = await this.reviewModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Review not found');
    }

    return deleted;
  }

}
