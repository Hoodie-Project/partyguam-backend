import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class PostionDto {
  @Expose()
  @ApiProperty({
    example: '기획',
    description: 'Position Main (직군)',
  })
  @IsNotEmpty()
  readonly main: object;

  @Expose()
  @ApiProperty({
    example: 'UI/UX 기획자',
    description: 'Position Sub (직무)',
  })
  @IsNotEmpty()
  readonly sub: object;
}

@Exclude()
export class PartyRecruitmentsResponseDto {
  @Expose()
  @ApiProperty({
    example: 3,
    description: 'party recruitment ID (PK - 파티 모집)',
  })
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  @ApiProperty({
    example: '해당 포지션에서 다양한 툴을 사용가능한 사람을 모집해요!',
    description: '모집에 대한 본문',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @Expose()
  @ApiProperty({
    example: 2,
    description: '모집인원',
  })
  @IsNotEmpty()
  readonly recruitingCount: number;

  @Expose()
  @ApiProperty({
    example: 1,
    description: '모집된 인원',
  })
  @IsNotEmpty()
  readonly recruitedCount: number;

  @Expose()
  @ApiProperty({
    example: 1,
    description: '현재 지원수',
  })
  @IsNotEmpty()
  readonly applicationCount: object;

  @Expose()
  @ApiProperty({
    example: 'active',
    description: '파티모집 공고 상태 active - 모집중, completed - 모집완료',
  })
  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @Expose()
  @ApiProperty({
    example: '2024-06-07T12:17:57.248Z',
    description: '생성일자',
  })
  @IsString()
  @IsNotEmpty()
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    example: PostionDto,
    description: '모집 포지션',
  })
  @Type(() => PostionDto)
  @IsString()
  @IsNotEmpty()
  readonly position: PostionDto;
}
