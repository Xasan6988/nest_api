import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';


export interface Movie extends Base {}
export class Movie extends TimeStamps {
  @prop({required: true})
  title: string

  @prop()
  description: string

  @prop()
  year: string

  @prop()
  image: string
}
