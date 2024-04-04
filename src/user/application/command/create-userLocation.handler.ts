import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserLocationCommand } from './create-userLocation.command';
import { IUserLocationRepository } from 'src/user/domain/user/repository/iuserLocation.repository';
import { LocationService } from 'src/location/location.service';

@Injectable()
@CommandHandler(CreateUserLocationCommand)
export class CreateUserLocationHandler implements ICommandHandler<CreateUserLocationCommand> {
  constructor(
    @Inject('UserLocationRepository') private userLocationRepository: IUserLocationRepository,
    private readonly locationService: LocationService,
  ) {}

  async execute(command: CreateUserLocationCommand) {
    const { userId, locationIds } = command;

    // 초과 저장 방지 로직
    if (locationIds) {
      if (locationIds.length === 3) {
        throw new ConflictException('관심지역을 3개 초과하여 저장 할 수 없습니다.');
      }
    }

    // locationId 확인
    await this.locationService.findByIds(locationIds);

    const userLocation = await this.userLocationRepository.findByUserId(userId);
    const userLocaiontId = userLocation.map((value) => value.locationId);

    // DB에 저장된 데이터 제외
    const duplicated = locationIds.filter((item) => userLocaiontId.includes(item));
    if (duplicated.length > 0) {
      throw new ConflictException(`이미 저장되어있는 데이터 입니다. { locationId : [${duplicated}]}`);
    }

    // 저장
    const result = await this.userLocationRepository.bulkInsert(userId, locationIds);

    return result;
  }
}
