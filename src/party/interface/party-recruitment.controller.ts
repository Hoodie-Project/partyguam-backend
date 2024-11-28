import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard, OptionalAccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PartyRecruitmentSwagger } from './partyRecruitment.swagger';

import { PartyRequestDto } from './dto/request/party.param.request.dto';
import { CreatePartyRecruitmentRequestDto } from './dto/request/recruitment/create-partyRecruitment.request.dto';
import { CreatePartyApplicationRequestDto } from './dto/request/application/create-application.request.dto';
import { PartyRecruitmentsParamRequestDto } from './dto/request/recruitment/partyRecruitment.param.request.dto';
import { PartyRecruitmentsResponseDto } from './dto/response/recruitment/party-recruitments.response.dto';
import { PartyRecruitmentParamRequestDto } from './dto/request/recruitment/partyRecruitment.param.request.dto copy';
import { PartyRecruitmentQueryRequestDto } from './dto/request/recruitment/partyRecruitment.query.request.dto';
import { PartyRecruitmentResponseDto } from './dto/response/recruitment/party-recruitment.response.dto';

import { CreatePartyApplicationCommand } from '../application/command/create-partyApplication.comand';
import { CreatePartyRecruitmentCommand } from '../application/command/create-partyRecruitment.comand';
import { UpdatePartyRecruitmentCommand } from '../application/command/update-partyRecruitment.comand';
import { DeletePartyRecruitmentCommand } from '../application/command/delete-partyRecruitment.comand';

import { GetPartyApplicationsQuery } from '../application/query/get-partyApplications.query';
import { GetPartyRecruitmentsQuery } from '../application/query/get-partyRecruitments.query';
import { GetPartyRecruitmentQuery } from '../application/query/get-partyRecruitment.query';
import { DeletePartyRecruitmentBodyRequestDto } from './dto/request/recruitment/delete-partyRecruitments.body.request.dto';
import { BatchDeletePartyRecruitmentCommand } from '../application/command/batchDelete-partyRecruitment.comand';
import { PartyApplicationQueryRequestDto } from './dto/request/application/partyApplication.query.request.dto';
import { PartyApplicationsResponseDto } from './dto/response/application/get-application.response.dto';
import { CreatePartyApplicationResponseDto } from './dto/response/application/create-application.response.dto';

@ApiBearerAuth('AccessJwt')
@ApiTags('party recruitment (파티 모집 공고)')
@Controller('parties')
export class PartyRecruitmentController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @UseGuards(OptionalAccessJwtAuthGuard)
  @Get('recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.getPartyRecruitment()
  async getRecruitmentById(@CurrentUser() user: CurrentUserType, @Param() param: PartyRecruitmentParamRequestDto) {
    const userId = user.id;

    const party = new GetPartyRecruitmentQuery(userId, param.partyRecruitmentId);

    const result = this.queryBus.execute(party);

    return plainToInstance(PartyRecruitmentResponseDto, result);
  }

  @Get(':partyId/recruitments')
  @PartyRecruitmentSwagger.getPartyRecruitments()
  async getPartyRecruitments(@Param() param: PartyRequestDto, @Query() query: PartyRecruitmentQueryRequestDto) {
    const { sort, order, main } = query;

    const party = new GetPartyRecruitmentsQuery(param.partyId, sort, order, main);
    const result = this.queryBus.execute(party);

    return plainToInstance(PartyRecruitmentsResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/recruitments')
  @PartyRecruitmentSwagger.createRecruitment()
  async createRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRequestDto,
    @Body() body: CreatePartyRecruitmentRequestDto,
  ) {
    const { positionId, content, recruiting_count } = body;

    const command = new CreatePartyRecruitmentCommand(user.id, param.partyId, positionId, content, recruiting_count);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch(':partyId/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.updateRecruitment()
  async updateRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
    @Body() body: CreatePartyRecruitmentRequestDto,
  ) {
    const { positionId, recruiting_count } = body;

    const command = new UpdatePartyRecruitmentCommand(
      user.id,
      param.partyId,
      param.partyRecruitmentId,
      positionId,
      recruiting_count,
    );

    const result = this.commandBus.execute(command);

    return plainToInstance(PartyRecruitmentsResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/recruitments/batch-delete')
  @PartyRecruitmentSwagger.batchDeleteRecruitment()
  @HttpCode(204)
  async batchDeleteRecruitment(
    @CurrentUser() user: CurrentUserType,
    @Body() body: DeletePartyRecruitmentBodyRequestDto,
    @Param() param: PartyRequestDto,
  ) {
    const { partyRecruitmentIds } = body;

    const command = new BatchDeletePartyRecruitmentCommand(user.id, param.partyId, partyRecruitmentIds);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete(':partyId/recruitments/:partyRecruitmentId')
  @PartyRecruitmentSwagger.deleteRecruitment()
  @HttpCode(204)
  async deleteRecruitment(@CurrentUser() user: CurrentUserType, @Param() param: PartyRecruitmentsParamRequestDto) {
    const command = new DeletePartyRecruitmentCommand(user.id, param.partyId, param.partyRecruitmentId);

    this.commandBus.execute(command);
  }

  // 모집공고에 지원
  @UseGuards(AccessJwtAuthGuard)
  @Post(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.createPartyApplication()
  async createPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
    @Body() dto: CreatePartyApplicationRequestDto,
  ) {
    const command = new CreatePartyApplicationCommand(user.id, param.partyId, param.partyRecruitmentId, dto.message);

    const result = this.commandBus.execute(command);

    return plainToInstance(CreatePartyApplicationResponseDto, result);
  }

  // 모집공고 지원자 조회
  @UseGuards(AccessJwtAuthGuard)
  @Get(':partyId/recruitments/:partyRecruitmentId/applications')
  @PartyRecruitmentSwagger.getPartyApplication()
  async getPartyApplication(
    @CurrentUser() user: CurrentUserType,
    @Param() param: PartyRecruitmentsParamRequestDto,
    @Query() query: PartyApplicationQueryRequestDto,
  ) {
    const { partyId, partyRecruitmentId } = param;
    const { page, limit, sort, order, status } = query;

    const application = new GetPartyApplicationsQuery(
      user.id,
      partyId,
      partyRecruitmentId,
      page,
      limit,
      sort,
      order,
      status,
    );

    const result = this.queryBus.execute(application);

    return plainToInstance(PartyApplicationsResponseDto, result);
  }
}
