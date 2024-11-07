import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';

import { UserFactory } from 'src/user/domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { User } from 'src/user/domain/user/user';
import { StatusEnum } from 'src/common/entity/baseEntity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async findByNickname(nickname: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { nickname },
    });

    if (!userEntity) {
      return null;
    }

    return this.userFactory.reconstitute(userEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });

    if (!userEntity) {
      return null;
    }

    return this.userFactory.reconstitute(userEntity);
  }

  async prepare() {
    const userEntity = await this.userRepository.save({ status: StatusEnum.INACTIVE });

    return userEntity.id;
  }

  async createUser(nickname: string, email: string, gender: string, birth: string): Promise<User> {
    const userEntity = await this.userRepository.save({ nickname, email, gender, birth });

    return this.userFactory.create(userEntity);
  }

  async updateUser(
    id: number,
    gender: string,
    genderVisible: boolean,
    birth: string,
    birthVisible: boolean,
    portfolio: string,
    image: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.save({ id, gender, genderVisible, birth, birthVisible, portfolio, image });

      await manager.save(user);
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async softDeleteUser(id: number) {
    await this.userRepository.save({ status: StatusEnum.DELETED, where: { id } });
  }
}
