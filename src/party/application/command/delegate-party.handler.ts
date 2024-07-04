import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';

import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { IPartyRecruitmentRepository } from 'src/party/domain/party/repository/iPartyRecruitment.repository';

import { IPartyApplicationRepository } from 'src/party/domain/party/repository/iPartyApplication.repository';
import { DelegatePartyCommand } from './delegate-party.comand';

@Injectable()
@CommandHandler(DelegatePartyCommand)
export class DelegatePartyApplicationHandler implements ICommandHandler<DelegatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyTypeRepository') private partyApplicationRepository: IPartyApplicationRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
    @Inject('PartyRecruitmentRepository') private partyRecruitmentRepository: IPartyRecruitmentRepository,
  ) {}

  async execute(command: DelegatePartyCommand) {
    const { userId, partyId, delegateUserId } = command;

    const party = await this.partyRepository.findOne(partyId);

    if (!party) {
      throw new BadRequestException('요청한 파티가 유효하지 않습니다.');
    }

    // 파티장만 승인 가능
    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority === PartyAuthority.MASTER) {
      throw new ForbiddenException('파티 모집 권한이 없습니다.');
    }

    const partyApplication = await this.partyApplicationRepository.findOneWithRecruitment(delegateUserId);

    // 권한 변경
    await this.partyUserRepository.createMember(
      partyApplication.userId,
      partyId,
      partyApplication.partyRecruitment.positionId,
    );
  }
}