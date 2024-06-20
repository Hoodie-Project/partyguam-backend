import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { AccessJwtAuthGuard } from 'src/common/guard/jwt.guard';
import { PositionResponseDto } from './dto/response/position.response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('positions')
@Controller('positions')
export class PositionController {
  constructor(private positionService: PositionService) {}

  @ApiBearerAuth('AccessJwt')
  @UseGuards(AccessJwtAuthGuard)
  @Get('')
  @ApiOperation({ summary: '포지션 항목 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '포지션 항목을 조회 하였습니다.',
    type: PositionResponseDto,
  })
  async getPositions() {
    const result = await this.positionService.findAll();

    return plainToInstance(PositionResponseDto, result);
  }
}
