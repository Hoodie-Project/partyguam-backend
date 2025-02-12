import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PartyEntity } from 'src/party/infra/db/entity/party/party.entity';

import { Repository } from 'typeorm';

import { PartyApplicationEntity } from 'src/party/infra/db/entity/apply/party_application.entity';
import { PartyAuthority, PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { GetPartyApplicationMeQuery } from './get-partyApplicationMe.query';
import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';

@QueryHandler(GetPartyApplicationMeQuery)
export class GetPartyApplicationMeHandler implements IQueryHandler<GetPartyApplicationMeQuery> {
  constructor(
    @InjectRepository(PartyRecruitmentEntity) private partyRecruitmentRepository: Repository<PartyRecruitmentEntity>,
    @InjectRepository(PartyApplicationEntity) private partyApplicationRepository: Repository<PartyApplicationEntity>,
  ) {}

  async execute(query: GetPartyApplicationMeQuery) {
    const { userId, partyId, partyRecruitmentId } = query;

    const party = await this.partyRecruitmentRepository
      .createQueryBuilder('partyRecruitments')
      .where('partyRecruitments.id = :id', { id: partyRecruitmentId })
      .andWhere('partyRecruitments.partyId = :partyId', { partyId })
      .getOne();

    if (!party) {
      throw new ForbiddenException('잘못된 요청입니다.');
    }

    const partyApplicationUserQuery = this.partyApplicationRepository
      .createQueryBuilder('partyApplication')
      .leftJoin('partyApplication.user', 'user')
      .select([
        'partyApplication.id',
        'partyApplication.message',
        'partyApplication.status',
        'partyApplication.createdAt',
      ])
      .where('partyApplication.partyRecruitmentId = :partyRecruitmentId', { partyRecruitmentId })
      .andWhere('partyApplication.userId = :userId', { userId });

    const application = await partyApplicationUserQuery.getOne();

    if (!application) {
      throw new NotFoundException('지원한 데이터를 찾을 수 없습니다.');
    }

    return application;
  }
}
