import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserFactory } from '../../domain/user/user.factory';
import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { UpdateUserCommand } from './update-user.command';
import { IUserSkillRepository } from 'src/user/domain/user/repository/iuser.skill.repository';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { userId, gender, genderVisible, birth, birthVisible, portfolio } = command;
    const user = await this.userRepository.updateUser(userId, gender, genderVisible, birth, birthVisible, portfolio);

    return user;
  }
}
