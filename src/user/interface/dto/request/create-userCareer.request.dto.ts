import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

class CareerDto {
  @ApiProperty({
    example: 1,
    description: 'Position id(pk)',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly positionId: number;

  @ApiProperty({
    example: 1,
    description: 'year',
  })
  @Max(50)
  @Min(0)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly years: number;
}

export class CreateUserCareerRequestDto {
  @ApiProperty({
    description: '주 경력',
    type: CareerDto,
  })
  @Type(() => CareerDto)
  @IsNotEmpty()
  readonly primary: CareerDto;

  @ApiProperty({
    description: '부 경력',
    type: CareerDto,
  })
  @Type(() => CareerDto)
  @IsOptional()
  readonly secondary: CareerDto;

  @ApiProperty({
    description: '기타 경력',
    type: CareerDto,
  })
  @ArrayMaxSize(3)
  @ArrayMinSize(1)
  @ArrayUnique()
  @Type(() => CareerDto)
  @IsArray()
  @IsOptional()
  readonly other: number[];
}