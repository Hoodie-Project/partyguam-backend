import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './repository/location.repository';

@Injectable()
export class LocationService {
  constructor(private locationRepository: LocationRepository) {}

  async findAll() {
    const result = await this.locationRepository.findAll();

    return result;
  }

  async findByProvince(province: string) {
    const result = await this.locationRepository.findByProvince(province);

    return result;
  }

  async findByIds(ids: number[]) {
    const result = await this.locationRepository.findByIds(ids);

    // 입력한 ids와 조회된 결과의 길이를 비교하여 존재하지 않는 id를 찾습니다.
    const existingIds = result.map((item) => item.id);
    const nonExistingIds = ids.filter((id) => !existingIds.includes(id));

    // 존재하지 않는 id가 있다면 해당 id들을 반환합니다.
    if (nonExistingIds.length > 0) {
      throw new NotFoundException(`${nonExistingIds}`);
    }

    return result;
  }
}
