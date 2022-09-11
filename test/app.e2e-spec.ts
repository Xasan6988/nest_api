import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module'
import { CreateMovieDto } from '../src/movies/dto/create-movie.dto';
import { CreateReviewDto } from '../src/reviews/dto/create-review.dto';
import { disconnect } from 'mongoose';
import { Movie } from '../src/movies/movies.model';
import { Review } from '../src/reviews/reviews.model';

const MockCreatedMovie: CreateMovieDto = {
  title: 'Test Title',
  description: 'Test description',
  year: '2000',
  image: ''
}

const MockCreateReview: CreateReviewDto = {
  name: 'Tester',
  title: 'Test review',
  description: 'test review...',
  rating: 5,
  movieId: undefined
}

describe('App', () => {
  let app: INestApplication;
  let createdMovie: Movie;
  let createdReview: Review;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    disconnect();
  })

  it('Create Moive - (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/movies')
      .send(MockCreatedMovie)
      .expect(201)
      .then(({body}: request.Response) => {
        createdMovie = body;
        expect(createdMovie._id).toBeDefined()
        expect(createdMovie.title).toBe('Test Title')
      });
    });

    it('Create Moive - (POST) - validation failed', async() => {
      return request(app.getHttpServer())
      .post('/movies')
      .send({...MockCreatedMovie, title: {some: 'data'}})
      .expect(500);
    });

    it('Create Review - (POST) - success', async () => {
      return request(app.getHttpServer())
      .post('/reviews')
      .send({...MockCreateReview, movieId: createdMovie._id})
      .expect(201)
      .then(({body}: request.Response) => {
        createdReview = body;
        expect(createdReview._id).toBeDefined();
        expect(createdReview.movieId).toEqual(createdMovie._id);
        expect(createdReview.name).toEqual('Tester');
      });
    });

    it('Create Review - (POST) - validation failed', async () => {
      return request(app.getHttpServer())
      .post('/reviews')
      .send({...MockCreateReview, rating: 'good'})
      .expect(500);
    });

    it('Get all Movie - (GET)', async () => {
      return request(app.getHttpServer())
      .get('/movies')
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body).toBeInstanceOf(Array);
        expect(body[0]._id).toBeDefined();
      });
    });

    it('Get Movie By ID - (GET) - success', async() => {
      return request(app.getHttpServer())
      .get(`/movies/${createdMovie._id}`)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.movie.title).toBe('Test Title');
        expect(body.reviews[0]._id).toEqual(createdReview._id);
      });
    });

    it('Get Movie By ID - (GET) - NOT FOUND', async() => {
      return request(app.getHttpServer())
      .get('/movies/6315ffe03978985f13e46ee1')
      .expect(404)
    });

    it('Get all Review - (GET)', async() => {
      return request(app.getHttpServer())
      .get('/reviews')
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body).toBeInstanceOf(Array);
        expect(body[0]._id).toBeDefined();
      });
    });

    it('Get Review by MovieId - (GET) - success', async () => {
      return request(app.getHttpServer())
      .get(`/reviews/${createdMovie._id}`)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body).toBeInstanceOf(Array)
        expect(body.length).toBeTruthy();
        expect(body[0]._id).toBeDefined();
      });
    });

    it('Get Review by MovieId - (GET) - NOT FOUND', async() => {
      return request(app.getHttpServer())
      .get('/reviews/6315ffe03978985f13e46ee1')
      .expect(404);
    });

    it('Update Movie - (PATCH)', async () => {
      return request(app.getHttpServer())
      .patch('/movies')
      .send({id: createdMovie._id, title: 'Updated title'})
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body).toBeDefined();
        expect(body._id).toEqual(createdMovie._id);
        expect(body.title).toBe('Updated title');
      });
    });

    it('Search Movie - (POST)', async () => {
      return request(app.getHttpServer())
      .post('/movies/search')
      .send({search: '2000'})
      .expect(201)
      .then(({body}: request.Response) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeTruthy();
      });
    });

    it('Delete Review - (DELETE)', async () => {
      return request(app.getHttpServer())
      .delete(`/reviews/${createdReview._id}`)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body._id).toEqual(createdReview._id);
      });
    });

    it('Delete Movie - (DELETE)', async () => {
      return request(app.getHttpServer())
      .delete(`/movies/${createdMovie._id}`)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body._id).toEqual(createdMovie._id);
      });
    });
});
