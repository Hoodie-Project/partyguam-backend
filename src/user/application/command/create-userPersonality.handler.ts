import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateUserPersonalityCommand } from './create-userPersonality.command';
import { IUserPersonalityRepository } from 'src/user/domain/user/repository/iuserPersonality.repository';
import { PersonalityService } from 'src/personality/personality.service';

@Injectable()
@CommandHandler(CreateUserPersonalityCommand)
export class CreateUserPersonalityHandler implements ICommandHandler<CreateUserPersonalityCommand> {
  constructor(
    @Inject('UserPersonalityRepository') private userPersonalityRepository: IUserPersonalityRepository,
    private readonly personalityService: PersonalityService,
  ) {}

  async execute(command: CreateUserPersonalityCommand) {
    let { userId, userPersonality } = command;
    const surveyPersonality = await this.personalityService.findAllPersonality();

    // 저장할 optionId
    let userPersonalityOptionIds = [];

    // 유저가 응답(저장) 되어있는 값 찾기
    const savedUserPersonality = await this.userPersonalityRepository.findByUserId(userId);
    const savedUserPersonalityOptionIds = savedUserPersonality.map((userPersonality) => {
      return userPersonality.personalityOptionId;
    });

    // 유저 응답별에 대해 validation 실행
    userPersonality.forEach((userAnswer) => {
      // 설문조사 질문, 선택지
      const surveyQuestion = surveyPersonality.find((question) => question.id === userAnswer.personalityQuestionId);
      const surveyOptionIds = surveyQuestion.personalityOption.map((option) => option.id);

      // 이미 설문을 한 항목에 대해 취소
      const duplicated = savedUserPersonalityOptionIds.some((saveOptionId) => surveyOptionIds.includes(saveOptionId));

      if (duplicated) {
        throw new BadRequestException(
          `이미 설문조사를 한 항목입니다. {questionId : ${userAnswer.personalityQuestionId}}`,
        );
      }

      // 다중 선택 체크
      if (surveyQuestion.responseCount < userAnswer.personalityOptionId.length) {
        throw new BadRequestException(
          `${surveyQuestion.responseCount}개 까지 저장 가능합니다. {questionId : ${userAnswer.personalityQuestionId}} `,
        );
      }

      // optionId 유효 확인
      userAnswer.personalityOptionId.map((optionId) => {
        const result = surveyOptionIds.includes(optionId);

        if (result) {
          userPersonalityOptionIds.push(optionId);
        } else {
          throw new BadRequestException(`질문에 맞지 않는 선택지 입니다. { optionId : ${optionId} }`);
        }
      });
    });

    // 저장
    const result = await this.userPersonalityRepository.bulkInsert(userId, userPersonalityOptionIds);

    return result;
  }
}
