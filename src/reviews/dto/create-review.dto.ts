import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { Types } from 'mongoose'

export class CreateReviewDto {
  @ApiProperty({example: 'John', description: 'Reviewer`s name'})
  @IsString()
  name: string

  @ApiProperty({example: 'How beautuful actors', description: 'Review`s title  '})
  @IsString()
  title: string

  @ApiProperty({example: 'In my opinion...', description: 'Review`s text'})
  @IsString()
  description: string

  @ApiProperty({example: '4', description: 'Review`s rating'})
  @IsNumber()
  rating: number

  @ApiProperty({example: 'Movie ID', description: 'Mongo Object Id'})
  @IsString()
  movieId: Types.ObjectId
}
