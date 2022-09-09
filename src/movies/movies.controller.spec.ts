import { Test } from '@nestjs/testing';
import { FilesModule } from '../files/files.module';
import { FilesService } from '../files/files.service';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { getModelToken } from 'nestjs-typegoose';
import { CreateMovieDto } from './dto/create-movie.dto';


const MockCreateMovieDto: CreateMovieDto = {
  title: 'Test Title',
  description: 'Test description',
  year: '2000',
  image: ''
}

describe('Movie controller', () => {
  let movieService: MoviesService;
  let movieController: MoviesController;
  let fileService: FilesService;

  let fileName: string;

  const id = uuid.v4()

  beforeEach(async () => {
    function mockMovieModel(dto: any) {
      this.data = dto;
      this.save = () => {
        return this.data;
      }
    }
    const moduleRef = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue:{
            create: jest
            .fn()
            .mockImplementation((dto, file) => ({...dto, id, image: file})),
            getById: jest
            .fn()
            .mockImplementation((id) => ({movie: {...MockCreateMovieDto, id, image: fileName}, reviews: [], reviewsCount: 0, reviewsAvg: null})),
            getAll: jest
            .fn()
            .mockResolvedValue([{...MockCreateMovieDto, image: fileName, id}]),
            delete: jest
            .fn()
            .mockResolvedValue({...MockCreateMovieDto, id, image: fileName}),
            update: jest
            .fn()
            .mockImplementation((dto) => ({...MockCreateMovieDto, ...dto, id, image: fileName}))
          }
        },
        {
          provide: getModelToken('Movie'),
          useValue: mockMovieModel
        }
      ],
      imports: [FilesModule]
    }).compile()
    movieService = moduleRef.get<MoviesService>(MoviesService);
    movieController = moduleRef.get<MoviesController>(MoviesController);
    fileService = moduleRef.get<FilesService>(FilesService);
  });

  it('save file', async () => {
    const file = fs.readFileSync(path.resolve(__dirname, '../../', 'dist', 'static', 'test.jpg'));
    fileName = await fileService.save({fieldname: 'image', originalname: 'blazzer.jpg', encoding: '7bit', mimetype: 'image/jpeg', buffer: file, size: 31702});
    const fileExist = fs.existsSync(path.resolve(__dirname, '../static/', fileName));
    expect(fileExist).toBeTruthy();
    fs.rmSync(path.resolve(__dirname, '../static'), {force: true, recursive: true});
  });

  it('create', async () => {
    expect(await movieController.create(MockCreateMovieDto, fileName)).toEqual({...MockCreateMovieDto, id, image: fileName});
  });

  it('getById', async () => {
    const result = {
      movie: {
        ...MockCreateMovieDto,
        id, image: fileName
      },
      reviews: [],
      reviewsCount: 0,
      reviewsAvg: null
    };
    expect(await movieController.getById(id)).toEqual(result);
  });

  it('getAll', async () => {
    expect(await movieController.getAll()).toEqual([{...MockCreateMovieDto, id, image: fileName}]);
  });

  it('update', async () => {
    expect(await movieController.update({title: 'Some', year: '1997', id})).toEqual({...MockCreateMovieDto, title: 'Some', year: '1997', id, image: fileName});
  });

  it('delete', async () => {
    expect(await movieController.delete(id)).toEqual({...MockCreateMovieDto, id, image: fileName});
  });
});
