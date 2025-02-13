import { ICommand } from '@nestjs/cqrs';

export class UpdatePartyRecruitmentCommand implements ICommand {
  constructor(
    readonly userId: number,
    readonly partyId: number,
    readonly partyRecruitmentId: number,
    readonly positionId: number,
    readonly content: string,
    readonly recruiting_count: number,
  ) {}
}
