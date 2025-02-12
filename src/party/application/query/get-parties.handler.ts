import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetPartiesQuery } from './get-parties.query';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';
import { PartyTypeEntity } from 'src/party/infra/db/entity/party/party_type.entity';

@QueryHandler(GetPartiesQuery)
export class GetPartiesHandler implements IQueryHandler<GetPartiesQuery> {
  constructor(
    @InjectRepository(PartyEntity) private partyRepository: Repository<PartyEntity>,
    @InjectRepository(PartyTypeEntity) private partyTypeRepository: Repository<PartyTypeEntity>,
  ) {}

  async execute(query: GetPartiesQuery) {
    const { page, limit, sort, order, status, partyTypeId, titleSearch } = query;

    const offset = (page - 1) * limit || 0;
    const partiesQuery = this.partyRepository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.partyType', 'partyType')
      .loadRelationCountAndMap('party.recruitmentCount', 'party.partyRecruitments')
      .limit(limit)
      .offset(offset)
      .orderBy(`party.${sort}`, order);

    if (status !== undefined && status !== null) {
      partiesQuery.andWhere('party.status = :status', { status });
    }

    if (titleSearch !== undefined && titleSearch !== null) {
      partiesQuery.andWhere('party.title LIKE :title', { title: `%${titleSearch}%` });
    }

    if (partyTypeId !== undefined) {
      partiesQuery.andWhere('party.partyTypeId IN (:...partyTypeId)', { partyTypeId });
    }

    const [parties, total] = await partiesQuery.getManyAndCount();

    return { total, parties };
  }
}
