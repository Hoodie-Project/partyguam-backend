import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { CreatePartyCommand } from '../application/command/create-party.comand';
import { UpdatePartyCommand } from '../application/command/update-party.comand';
import { DeletePartyCommand } from '../application/command/delete-party.comand';

import { GetPartiesQuery } from '../application/query/get-parties.query';
import { GetPartyQuery } from '../application/query/get-party.query';

import { PartyRequestDto } from './dto/request/party.param.request.dto';

import { CreatePartyRequestDto } from './dto/request/create-party.request.dto';
import { UpdatePartyRequestDto } from './dto/request/update-party.request.dto';
import { PartyQueryRequestDto } from './dto/request/party.query.request.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { GetPartyTypesQuery } from '../application/query/get-partyTypes.query';

@ApiTags('파티')
@UseGuards(AccessJwtAuthGuard)
@Controller('parties')
export class PartyController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('types')
  @ApiOperation({ summary: '파티 타입 리스트 조회' })
  async getPartyType() {
    const party = new GetPartyTypesQuery();
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyResponseDto, result);
  }

  @Post('')
  @ApiOperation({ summary: '파티 필수 생성' })
  async createParty(@CurrentUser() user: CurrentUserType, @Body() dto: CreatePartyRequestDto): Promise<void> {
    const { title, content, partyTypeId } = dto;

    const command = new CreatePartyCommand(user.id, title, content, partyTypeId);

    return this.commandBus.execute(command);
  }

  @Get(':partyId')
  @ApiOperation({ summary: '파티 상세 조회' })
  async getParty(@Param() param: PartyRequestDto) {
    const party = new GetPartyQuery(param.partyId);
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyResponseDto, result);
  }

  @Get('')
  @ApiOperation({ summary: '파티 목록 조회' })
  async getParties(@Query() query: PartyQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const parties = new GetPartiesQuery(page, limit, sort, order);
    const result = this.queryBus.execute(parties);

    return plainToInstance(PartyResponseDto, result);
  }

  @Patch(':partyId')
  @ApiOperation({ summary: '파티 수정' })
  async updateParty(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() dto: UpdatePartyRequestDto,
  ): Promise<void> {
    const { title, content } = dto;

    const command = new UpdatePartyCommand(user.id, param.partyId, title, content);

    return this.commandBus.execute(command);
  }

  @HttpCode(204)
  @Delete(':partyId')
  @ApiOperation({ summary: '파티 삭제 (softdelete)' })
  async deleteParty(@CurrentUser() user: CurrentUserType, @Param() param: PartyRequestDto): Promise<void> {
    const command = new DeletePartyCommand(user.id, param.partyId);

    this.commandBus.execute(command);
  }

  // 지원
  @Get(':partyId/application')
  @ApiOperation({ summary: '파티 지원 조회' })
  async getPartyRequestList(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Body() dto: CreatePartyRequestDto,
  ): Promise<void> {
    dto;
  }

  @Post(':partyId/application')
  @ApiOperation({ summary: '파티 지원' })
  async sendPartyRequest(@CurrentUser() user: CurrentUserType, @Param('partyId') partyId: number): Promise<void> {
    partyId;
  }

  @Delete(':partyId/application')
  @ApiOperation({ summary: '파티 지원 취소' })
  async deletePartyRequest(@CurrentUser() user: CurrentUserType, @Param('partyId') partyId: number): Promise<void> {
    partyId;
  }

  // 초대
  @Get(':partyId/invitation')
  @ApiOperation({ summary: '파티 초대 조회' })
  async getPartyInvitationList(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Body() dto: CreatePartyRequestDto,
  ): Promise<void> {
    dto;
  }

  @Post(':partyId/invitation/:nickname')
  @ApiOperation({ summary: '파티 초대' })
  async sendPartyInvitation(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Param('nickname') nickname: string,
    @Body() dto: PartyRequestDto,
  ): Promise<void> {
    dto;
  }

  @Delete(':partyId/invitation/:nickname')
  @ApiOperation({ summary: '파티 초대 취소' })
  async deletePartyInvitation(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Param('nickname') nickname: string,
    @Body() dto: PartyRequestDto,
  ): Promise<void> {
    dto;
  }

  // 권한
  @Post(':partyId/delegation')
  @ApiOperation({ summary: '파티장 위임' })
  async transferPartyLeadership(
    @CurrentUser() user: CurrentUserType,
    @Param('partyId') partyId: number,
    @Body() dto: CreatePartyRequestDto,
  ): Promise<void> {
    dto;
  }
}
