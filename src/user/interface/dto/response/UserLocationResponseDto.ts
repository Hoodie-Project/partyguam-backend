import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserLocationResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 1 })
  userId: number;

  @Expose()
  @ApiProperty({ example: 1 })
  locationId: number;
}

@Exclude()
export class UserLocationsResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  count: number;

  @Expose()
  @ApiProperty({ type: UserLocationResponseDto })
  data: UserLocationResponseDto[];
}