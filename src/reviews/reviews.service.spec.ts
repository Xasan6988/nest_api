import { Test, TestingModule } from '@nestjs/testing';
import { TypegooseModule } from 'nestjs-typegoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './reviews.model';
import { ReviewsService } from './reviews.service';
import * as uuid from 'uuid';
import { disconnect } from 'mongoose';

const MockCreateReviewDto: CreateReviewDto = {
  name: 'Tester',
  title: 'Test review',
  description: 'test review...',
  rating: 5,
  movieId: '6315ffe03978985f13e46ee6'
};

describe('ReviewsService', () => {
  let service: ReviewsService;
  let objectId;

  let createdReview;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypegooseModule.forRoot('mongodb://localhost:27017/nestapi'),
        TypegooseModule.forFeature([
          {
            typegooseClass: Review,
            schemaOptions: {
              collection: 'reviews'
            }
          }
        ])
      ],

      providers: [ReviewsService],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  afterAll(() => {
    disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create', async () => {
    const review = await service.create(MockCreateReviewDto);
    createdReview = review;
    objectId = review._id;

    expect(review).toBeDefined();
    expect(review._id).toBeDefined();
    expect(review.name).toBe('Tester');
    expect(review.movieId.toString()).toBe(MockCreateReviewDto.movieId);
  });

  it('getAll', async () => {
    const reviews = await service.getAll();

    expect(reviews).toBeInstanceOf(Array);
    expect(reviews.length).toBeTruthy();
    expect(reviews[0]._id).toBeDefined();
  });

  it('getByMovieId', async () => {
    const reviews = await service.getByMovieId(MockCreateReviewDto.movieId);

    expect(reviews).toBeDefined();
    expect(reviews).toBeInstanceOf(Array);
    expect(reviews.length).toBeTruthy();
  });

  it('getByMovieId - NOT FOUND', async () => {
    expect.assertions(2);

    try {
      await service.getByMovieId('6315ffe03978985f13e46ee1');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual('Reviews not found');
    }
  });

  it('delete', async () => {
    const deleted = await service.delete(objectId);
    expect(deleted).toBeDefined();
    expect(deleted._id).toEqual(objectId);
    expect(deleted.name).toBe('Tester');
  });

  it('detele - NOT FOUND', async () => {
    expect.assertions(2);

    try {
      await service.delete(objectId);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('Review not found');
    }
  });
});
