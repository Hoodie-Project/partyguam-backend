import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
} from 'class-validator';

export class PersonalityDto {
  @ApiProperty({
    example: 1,
    description: '질문 문항 personality questionId (pk)',
  })
  @Max(4)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly personalityQuestionId: number;

  @ApiProperty({
    example: 1,
    description: '선택 문항 personality optionId (pk)',
  })
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  @ArrayUnique()
  @ArrayMaxSize(2)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  readonly personalityOptionId: number[];
}

export class CreateUserPersonalityRequestDto {
  @ApiProperty({
    example: [{ personalityQuestionId: 1, personalityOptionId: [1, 2] }],
    description: '성향 저장',
  })
  @Type(() => PersonalityDto)
  @ArrayUnique()
  @IsArray()
  @IsNotEmpty()
  readonly personality: PersonalityDto[];
}
