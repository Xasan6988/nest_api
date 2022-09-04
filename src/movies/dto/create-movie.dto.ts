import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({example: 'Titanic', description: 'Film`s title'})
  @IsString()
  title: string
  @ApiProperty({example: 'Film about travel on the ship and tragedy', description: 'Film`s description'})
  @IsOptional()
  @IsString()
  description: string
  @ApiProperty({example: '2000', description: 'Film`s year of release'})
  @IsOptional()
  @IsString()
  year: string

  @ApiProperty({example: 'titanic.jpg', description: 'Upload file'})
  image: any
}
