import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';

import { UpdateResult } from 'typeorm';

export interface IPartyRecruitmentRepository {
  create: (partyId: number, positionId: number, capacity: number) => Promise<PartyRecruitmentEntity>;
  // bulkInsert: (partyId: number, recruitment: RecruitmentRequestDto[]) => Promise<PartyRecruitmentEntity[]>;
  findOne: (id: number) => Promise<PartyRecruitmentEntity>;
  findAllByPartyId: (partyId: number) => Promise<PartyRecruitmentEntity[]>;
  update: (id: number, positionId: number, recruitingCount: number) => Promise<UpdateResult>;
  updateRecruitedCount: (id: number, recruitedCount: number) => Promise<PartyRecruitmentEntity>;
  delete: (id: number) => Promise<void>;
}
