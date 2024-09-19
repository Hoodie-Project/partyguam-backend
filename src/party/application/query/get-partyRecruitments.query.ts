import { IQuery } from '@nestjs/cqrs';

export class GetPartyRecruitmentsQuery implements IQuery {
  constructor(
    readonly partyId: number,
    readonly sort: string,
    readonly order: 'ASC' | 'DESC',
    readonly main: string | null,
  ) {}
}