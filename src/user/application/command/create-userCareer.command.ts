import { ICommand } from '@nestjs/cqrs';
import { CareerDto } from 'src/user/interface/dto/career.dto';

export class CreateUserCareerCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly career: CareerDto[],
  ) {}
}
