import { Movie } from './movies.model';
import { MoviesService } from './movies.service';
import { FilesService } from '../files/files.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypegooseModule } from 'nestjs-typegoose';
import { disconnect } from 'mongoose';



const MockCreateMovieDto = {
  title: 'Test',
  description: 'Test description',
  year: '1997',
  image: '',
}

describe('Movie Service', () => {
  let service: MoviesService;
  let objectId;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypegooseModule.forRoot('mongodb://localhost:27017/nestapi'),
        TypegooseModule.forFeature([
          {
            typegooseClass: Movie,
            schemaOptions: {
              collection: 'movies'
            }
          }
        ]),
      ],
      providers: [
        MoviesService,
        {
          provide: FilesService,
          useValue: {
            save: jest
              .fn()
              .mockImplementation((file: string) => file)
          }
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterAll(() => {
    disconnect()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  it('create', async () => {
    const movie = await service.create(MockCreateMovieDto, 'image.jpg');

    objectId = movie._id;

    expect(movie).toBeDefined();
    expect(movie._id).toBeDefined();
    expect(movie.image).toEqual('image.jpg');
  });

  it('getById', async () => {
    const movie = await service.getById(objectId);
    expect(movie).toBeDefined();
    expect(movie._id).toEqual(objectId);
  });

  it('getById - NOT FOUND', async () => {
    expect.assertions(2);
    try {
      await service.getById('6315ffe03978985f13e46ee1');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual('Movie not found');
    }
  });

  it('getAll', async () => {
    const movies = await service.getAll();
    expect(movies).toBeInstanceOf(Array);
    expect(movies.length).toBeTruthy();
    expect(movies[0]._id).toBeDefined();
  });

  it('update', async () => {
    const movie = await service.update({title: 'Changed title', id: objectId});

    expect(movie).toBeDefined();
    expect(movie._id).toEqual(objectId);
    expect(movie.title).toEqual('Changed title');
  });

  it('update - NOT FOUND', async () => {
    expect.assertions(2);
    try {
      await service.update({id: '6315ffe03978985f13e46ee1', title: 'Chaged Title'});
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('Movie not found');
    }
  });

  it('delete', async () => {
    try {
      const deleted = await service.delete(objectId);

      expect(deleted).toBeDefined();
      expect(deleted).toBeInstanceOf(Movie);
      expect(deleted._id).toBeDefined()
    } catch (e) {}
  });

  it('delete - NOT FOUND', async () => {
    expect.assertions(2);

    try {
      await service.delete('6315ffe03978985f13e46ee1');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual('Movie not found');
    }
  });
});
