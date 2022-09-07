import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationExeption } from 'src/exceptions/validation.exception';
import {plainToClass} from 'class-transformer';
import { validate } from 'class-validator';


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      let messages = errors.map(error => {
        return `${error.property} - ${Object.values(error.constraints).join(', ')}`;
      });

      throw new ValidationExeption(messages);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
