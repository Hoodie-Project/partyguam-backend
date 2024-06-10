import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { RecruitmentDto } from '../recruitmentDto';

export class CreatePartyRecruitmentRequestDto {
  @ApiProperty({
    description: '모집',
    type: [RecruitmentDto],
  })
  @ValidateNested({ each: true })
  @Type(() => RecruitmentDto)
  @ArrayUnique()
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  readonly recruitment: RecruitmentDto[];
}