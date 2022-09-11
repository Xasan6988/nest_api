import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export interface Review extends Base {}
export class Review extends TimeStamps {
  @ApiProperty({example: 'John', description: 'Reviewer`s name'})
  @IsString()
  @prop()
  name: string

  @ApiProperty({example: 'How beautuful actors', description: 'Review`s title  '})
  @IsString()
  @prop()
  title: string

  @ApiProperty({example: 'In my opinion...', description: 'Review`s text'})
  @IsString()
  @prop()
  description: string

  @ApiProperty({example: '4', description: 'Review`s rating'})
  @IsNumber()
  @prop()
  rating: number

  @ApiProperty({example: 'Movie ID', description: 'Mongo Object Id'})
  @prop()
  movieId: Types.ObjectId;
}
