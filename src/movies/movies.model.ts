import { ApiProperty } from '@nestjs/swagger';
import { prop, index } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';


export interface Movie extends Base {}
@index({title: 'text', description: 'text', year: 'text'})
export class Movie extends TimeStamps {
  @ApiProperty({example: 'Titanic', description: 'Film`s title'})
  @prop({required: true})
  title: string

  @ApiProperty({example: 'Film about travel on the ship and tragedy', description: 'Film`s description'})
  @prop()
  description: string

  @ApiProperty({example: '2000', description: 'Film`s year of release'})
  @prop()
  year: string

  @ApiProperty({example: 'titanic.jpg', description: 'Film`s poster'})
  @prop()
  image: string
}
