import { Test, TestingModule } from '@nestjs/testing';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import * as uuid from 'uuid';
import { getModelToken } from 'nestjs-typegoose';

const MockCreateReviewDto: CreateReviewDto = {
  name: 'Tester',
  title: 'Test review',
  description: 'test review...',
  rating: 5,
  movieId: '6315ffe03978985f13e46ee6'
};

describe('Reviews Controller', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  const id = uuid.v4();

  beforeEach(async () => {
    function mockReviewModel(dto: any) {
      this.data = dto;
      this.save = () => {
        return this.data;
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            create: jest
            .fn()
            .mockImplementation((dto) => ({...dto, id})),
            getAll: jest
            .fn()
            .mockResolvedValue([{...MockCreateReviewDto, id}]),
            getByMovieId: jest
            .fn()
            .mockImplementation((id) => ({...MockCreateReviewDto, id})),
            delete: jest
            .fn()
            .mockImplementation((id) => ({...MockCreateReviewDto, id}))
          }
        },
        {
          provide: getModelToken('Review'),
          useValue: mockReviewModel
        }
      ]
    }).compile();
    service = module.get<ReviewsService>(ReviewsService);
    controller = module.get<ReviewsController>(ReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create', async () => {
    expect(await controller.create(MockCreateReviewDto)).toEqual({...MockCreateReviewDto, id});
  });

  it('getAll', async () => {
    expect(await controller.getAll()).toEqual([{...MockCreateReviewDto, id}]);
  });

  it('getByMovieId', async () => {
    expect(await controller.getByMovieId(id)).toEqual({...MockCreateReviewDto, id});
  });

  it('getByMovieId - NOT FOUND',async () => {
    jest.spyOn(service as any, 'getByMovieId').mockImplementation((id) => {
      throw new Error('Movie not found');
    });
    expect.assertions(2);

    try {
      await controller.getByMovieId(id);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual('Movie not found');
    }
  });

  it('delete', async () => {
    expect(await controller.delete(id)).toEqual({...MockCreateReviewDto, id});
  })
  it('delete - NOT FOUND', async () => {
    jest.spyOn(service as any, 'delete').mockImplementation((id) => {
      throw new Error('Movie not found');
    });
    expect.assertions(2);

    try {
      await controller.delete(id);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual('Movie not found');
    }
  })
});
