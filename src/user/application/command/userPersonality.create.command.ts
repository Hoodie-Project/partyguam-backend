import { ICommand } from '@nestjs/cqrs';
import { PersonalityDto } from 'src/user/interface/dto/personality.dto';

export class UserPersonalityCreateCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly personality: PersonalityDto[],
  ) {}
}