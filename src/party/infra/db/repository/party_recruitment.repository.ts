import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StatusEnum } from 'src/common/entity/baseEntity';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';
import { PartyRecruitmentEntity } from '../entity/apply/party_recruitment.entity';

@Injectable()
export class PartyRecruitmentRepository implements IPartyRecruitmentRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(PartyRecruitmentEntity)
    private partyRecruitmentRepository: Repository<PartyRecruitmentEntity>,
  ) {}

  async create(partyId: number, positionId: number, content: string, recruitingCount: number) {
    const partyRecruitment = await this.partyRecruitmentRepository.save({
      partyId,
      positionId,
      content,
      recruitingCount,
    });

    return partyRecruitment;
  }

  // async bulkInsert(partyId: number, recruitment: RecruitmentRequestDto[]) {
  //   const partyRecruitments = recruitment.map((value) => ({
  //     partyId,
  //     ...value,
  //   }));

  //   try {
  //     const result = await this.partyRecruitmentRepository.save(partyRecruitments);
  //     return result;
  //   } catch (error) {
  //     if (error.driverError.code === '23505') throw new BadRequestException('중복으로 포지션을 넣을 수 없습니다.');
  //   }
  // }

  async findAllByPartyId(partyId: number) {
    const partyRecruitment = await this.partyRecruitmentRepository.find({
      where: { partyId },
    });

    return partyRecruitment;
  }

  async findOne(id: number) {
    const partyRecruitment = await this.partyRecruitmentRepository.findOne({
      where: { id },
      relations: ['position'],
    });

    return partyRecruitment;
  }

  async update(id: number, positionId: number, content: string, recruitingCount: number) {
    return await this.partyRecruitmentRepository.update(id, { positionId, content, recruitingCount });
  }

  async updateStatusCompleted(id: number) {
    await this.partyRecruitmentRepository.update(id, { status: StatusEnum.COMPLETED });
  }

  async updateRecruitedCount(id: number, recruitedCount: number) {
    return await this.partyRecruitmentRepository.save({ id, recruitedCount });
  }

  async delete(id: number) {
    await this.partyRecruitmentRepository.delete({ id });
  }

  async softDelete(recruitmentId: number) {
    const partyRecruitment = await this.findOne(recruitmentId);
    const status = StatusEnum.DELETED;

    await this.partyRecruitmentRepository.save({ ...partyRecruitment, status });
  }

  async batchDelete(recruitmentIds: number[]) {
    await this.partyRecruitmentRepository.delete(recruitmentIds);
  }

  async deleteAll(partyId: number) {
    await this.partyRecruitmentRepository.delete({ partyId });
  }
}
