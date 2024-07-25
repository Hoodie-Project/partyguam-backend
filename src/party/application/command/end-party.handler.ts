import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { EndPartyCommand } from './end-party.comand';

@Injectable()
@CommandHandler(EndPartyCommand)
export class EndPartyHandler implements ICommandHandler<EndPartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: EndPartyCommand) {
    const { userId, partyId } = command;

    const findParty = await this.partyRepository.findOne(partyId);

    if (findParty) {
      throw new NotFoundException('PARTY_NOT_EXIST', '파티를 찾을 수 없습니다.');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (partyUser.authority !== 'master') {
      throw new ForbiddenException('ACCESS_DENIED', '파티 종료 권한이 없습니다.');
    }

    await this.partyRepository.archivedById(partyId);
  }
}