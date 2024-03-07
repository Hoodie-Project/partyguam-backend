import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentUserType } from 'src/common/decorators/auth.decorator';
import { AccessJwtAuthGuard, SignupJwtAuthGuard } from 'src/common/guard/jwt.guard';

import { KakaoCodeCommand } from '../application/command/kakao-code.command';
import { CreateUserCommand } from '../application/command/create-user.command';
import { UpdateUserCommand } from '../application/command/update-user.command';
import { FollowCommand } from '../application/command/follow.command';
import { UnfollowCommand } from '../application/command/unfollow.command';

import { UserLoginRequestDto } from './dto/request/user-login.request.dto';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UserParamRequestDto } from './dto/request/user.param.request.dto';
import { UserQueryRequestDto } from './dto/request/user.query.request.dto';

import { UserByNicknameQuery } from '../application/query/get-user-by-nickname.query';
import { GetUserQuery } from '../application/query/get-user.query';
import { GetUsersQuery } from '../application/query/get-users.query';

import { UserResponseDto, UsersResponseDto } from './dto/response/UserResponseDto';
import { FollowQueryRequestDto } from './dto/request/follow.user.request.dto';
import { GetFollowQuery } from '../application/query/get-follow.query';
import { FollowResponseDto } from './dto/response/FollowResponseDto';
import { NicknameQueryRequestDto } from './dto/request/nickname.query.request.dto';
import { GetCheckNicknameQuery } from '../application/query/get-check-nickname.query';
import { KakaoDataCommand } from '../application/command/kakao-data.command';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('test/signup')
  @ApiOperation({ summary: '일반 회원가입 (테스트 계정 구현 용도)' })
  async createUser(@Res() res: Response, @Body() dto: CreateUserRequestDto): Promise<void> {
    const { nickname, email, gender, birth } = dto;

    const command = new CreateUserCommand(nickname, email, gender, birth);

    const result = await this.commandBus.execute(command);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.send({ accessToken: result.accessToken });
  }

  @Post('kakao')
  @ApiOperation({ summary: '카카오 로그인' })
  async signinByKakao(@Res() res: Response) {
    const command = new KakaoCodeCommand();

    const result = await this.commandBus.execute(command);

    res.redirect(result);
  }

  @Get('kakao/callback')
  @ApiOperation({ summary: '카카오 로그인 리다이렉트 API' })
  async kakaoCallback(@Res() res: Response, @Query('code') code: string) {
    const command = new KakaoDataCommand(code);

    const result = await this.commandBus.execute(command);

    if (result.type === 'login') {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      res.status(200).send({ accessToken: result.accessToken });
    }

    if (result.type === 'signup') {
      res.status(404).send({ signupAccessToken: result.signupAccessToken, email: result.email });
    }
  }

  @UseGuards(SignupJwtAuthGuard)
  @Get('check-nickname')
  @ApiOperation({ summary: '닉네임 중복검사' })
  @ApiResponse({
    status: 200,
    description: '사용가능한 닉네임 입니다.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '중복된 닉네임 입니다.',
    type: UserResponseDto,
  })
  async checkNickname(@Query() query: NicknameQueryRequestDto) {
    const { nickname } = query;
    const getUserInfoQuery = new GetCheckNicknameQuery(nickname);

    await this.queryBus.execute(getUserInfoQuery);

    return '사용가능한 닉네임 입니다.';
  }

  @UseGuards(SignupJwtAuthGuard)
  @Post('signup/required')
  @ApiOperation({ summary: '회원가입 (필수)' })
  async signUpByKakao(@Res() res: Response, @Body() dto: CreateUserRequestDto): Promise<void> {
    const { nickname, email, gender, birth } = dto;

    const command = new CreateUserCommand(nickname, email, gender, birth);

    const result = await this.commandBus.execute(command);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.send({ accessToken: result.accessToken });
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('location')
  @ApiOperation({ summary: '지역' })
  async userLocation(@CurrentUser() user: CurrentUserType, @Body() dto: UpdateUserRequestDto): Promise<void> {
    const command = new UpdateUserCommand(user.id);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('personality')
  @ApiOperation({ summary: '성향' })
  async userPersonality(@CurrentUser() user: CurrentUserType, @Body() dto: UpdateUserRequestDto): Promise<void> {
    const command = new UpdateUserCommand(user.id);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('postion')
  @ApiOperation({ summary: '포지션' })
  async userPosition(@CurrentUser() user: CurrentUserType, @Body() dto: UpdateUserRequestDto): Promise<void> {
    const command = new UpdateUserCommand(user.id);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('')
  @ApiOperation({ summary: '회원탈퇴' })
  async deleteUser(@CurrentUser() user: CurrentUserType, @Body() dto: UpdateUserRequestDto): Promise<void> {
    const command = new UpdateUserCommand(user.id);

    return this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('')
  @ApiOperation({ summary: '로그아웃' })
  async signOut(@CurrentUser() user: CurrentUserType): Promise<void> {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('info')
  @ApiOperation({ summary: '내정보 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 내정보 목록을 가져왔습니다.',
    type: UserResponseDto,
  })
  async getMyInfo(@CurrentUser() account): Promise<UserResponseDto> {
    const getUserInfoQuery = new GetUserQuery(account.id);

    const result = this.queryBus.execute(getUserInfoQuery);

    return plainToInstance(UserResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch('info')
  @ApiOperation({ summary: '내정보 변경' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 내정보 목록을 가져왔습니다.',
    type: UserResponseDto,
  })
  async updateUser(@CurrentUser() account): Promise<UserResponseDto> {
    const getUserInfoQuery = new GetUserQuery(account.id);

    const result = this.queryBus.execute(getUserInfoQuery);

    return plainToInstance(UserResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Patch('image')
  @ApiOperation({ summary: '이미지 변경' })
  @ApiResponse({
    status: 200,
    description: '.',
    type: UserResponseDto,
  })
  async updateImage(@CurrentUser() account) {}

  @Get('info/:nickname')
  @ApiOperation({ summary: '닉네임으로 유저 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 유저 목록을 가져왔습니다.',
    type: UserResponseDto,
  })
  async getUser(@Param() param: UserParamRequestDto) {
    const userInfoByNickname = new UserByNicknameQuery(param.nickname);

    const result = this.queryBus.execute(userInfoByNickname);

    return plainToInstance(UserResponseDto, result);
  }

  @Get('')
  @ApiOperation({ summary: '유저 다수 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 유저 목록을 가져왔습니다.',
    type: UsersResponseDto,
  })
  async getUsers(@Query() query: UserQueryRequestDto) {
    const { page, limit, sort, order } = query;

    const userInfoByNickname = new GetUsersQuery(page, limit, sort, order);

    const result = this.queryBus.execute(userInfoByNickname);

    return plainToInstance(UserResponseDto, result);
  }

  //! MVP 제외
  @UseGuards(AccessJwtAuthGuard)
  @Get('follow')
  @ApiOperation({ summary: '팔로워, 팔로잉 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 팔로우 or 팔로잉이 조회 되었습니다.',
    type: FollowResponseDto,
  })
  async getFollow(
    @CurrentUser() user: CurrentUserType,
    @Query() query: FollowQueryRequestDto,
  ): Promise<FollowResponseDto> {
    const { page, limit, sort, order } = query;

    const userInfoByNickname = new GetFollowQuery(user.id, page, limit, sort, order);

    const result = await this.queryBus.execute(userInfoByNickname);

    return plainToInstance(FollowResponseDto, result);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('follow/:nickname')
  @ApiOperation({ summary: '팔로우' })
  @ApiResponse({
    status: 204,
    description: '성공적으로 팔로우 되었습니다.',
  })
  async follow(@CurrentUser() user: CurrentUserType, @Param() param: UserParamRequestDto) {
    const command = new FollowCommand(user.id, param.nickname);

    await this.commandBus.execute(command);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Delete('unfollow/:nickname')
  @ApiOperation({ summary: '언팔로우' })
  @ApiResponse({
    status: 204,
    description: '성공적으로 언팔로우 되었습니다.',
  })
  async unfollow(@CurrentUser() user: CurrentUserType, @Param() param: UserParamRequestDto) {
    const command = new UnfollowCommand(user.id, param.nickname);

    await this.commandBus.execute(command);
  }
}
