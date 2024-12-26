import { ArgumentMetadata, Injectable, PipeTransform ,BadRequestException} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Invalid ID: ${value}`);
    }
    return value;
  }
}
