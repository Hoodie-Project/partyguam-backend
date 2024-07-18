import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PartyFactory } from 'src/party/domain/party/party.factory';
import { IPartyRepository } from 'src/party/domain/party/repository/iParty.repository';
import { IPartyUserRepository } from 'src/party/domain/party/repository/iPartyUser.repository';
import { UpdatePartyCommand } from './update-party.comand';
import { PartyAuthority } from 'src/party/infra/db/entity/party/party_user.entity';
import { promises as fs } from 'fs';

@Injectable()
@CommandHandler(UpdatePartyCommand)
export class UpdatePartyHandler implements ICommandHandler<UpdatePartyCommand> {
  constructor(
    private partyFactory: PartyFactory,
    @Inject('PartyRepository') private partyRepository: IPartyRepository,
    @Inject('PartyUserRepository') private partyUserRepository: IPartyUserRepository,
  ) {}

  async execute(command: UpdatePartyCommand) {
    const { userId, partyId, partyTypeId, title, content, image } = command;

    const findParty = await this.partyRepository.findOne(partyId);

    if (findParty) {
      throw new NotFoundException('PARTY_NOT_EXIST', '파티를 찾을 수 없습니다.');
    }

    const partyUser = await this.partyUserRepository.findOne(userId, partyId);

    if (!partyUser) {
      throw new NotFoundException('PARTY_USER_NOT_EXIST', '파티유저를 찾을 수 없습니다.');
    }

    if (partyUser.authority === PartyAuthority.MEMBER) {
      throw new ForbiddenException('ACCESS_DENIED', '파티 수정 권한이 없습니다.');
    }

    const party = this.partyFactory.create(findParty);

    if (party.image && image) {
      await fs.unlink(party.image);
    }

    party.updateFields(partyTypeId, title, content, image);

    const result = await this.partyRepository.update(party);

    return result;
  }
}
