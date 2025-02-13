import { PartyRecruitmentEntity } from 'src/party/infra/db/entity/apply/party_recruitment.entity';

import { UpdateResult } from 'typeorm';

export interface IPartyRecruitmentRepository {
  create: (
    partyId: number,
    positionId: number,
    content: string,
    recruitingCount: number,
  ) => Promise<PartyRecruitmentEntity>;
  // bulkInsert: (partyId: number, recruitment: RecruitmentRequestDto[]) => Promise<PartyRecruitmentEntity[]>;
  findOne: (id: number) => Promise<PartyRecruitmentEntity>;
  findAllByPartyId: (partyId: number) => Promise<PartyRecruitmentEntity[]>;
  update: (id: number, positionId: number, content: string, recruitingCount: number) => Promise<UpdateResult>;
  updateStatusCompleted: (id: number) => Promise<void>;
  updateRecruitedCount: (id: number, recruitedCount: number) => Promise<PartyRecruitmentEntity>;
  delete: (id: number) => Promise<void>;
  softDelete: (id: number) => Promise<void>;
  batchDelete: (id: number[]) => Promise<void>;
  deleteAll: (id: number) => Promise<void>;
}
