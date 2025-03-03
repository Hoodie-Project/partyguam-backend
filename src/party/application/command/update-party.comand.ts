import { ICommand } from '@nestjs/cqrs';
import { StatusEnum } from 'src/common/entity/baseEntity';

export class UpdatePartyCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyTypeId: number,
    readonly title: string,
    readonly content: string,
    readonly image: string,
    readonly status: StatusEnum,
  ) {}
}
