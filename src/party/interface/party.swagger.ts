import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PartyTypeResponseDto } from './dto/response/partyType.response.dto';
import { PartyResponseDto } from './dto/response/party.response.dto';
import { GetPartiesResponseDto } from './dto/response/get-parties.response.dto';
import { GetPartyResponseDto } from './dto/response/get-party.response.dto';

export class PartySwagger {
  static getTypes() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 타입 리스트 조회',
        description: `**파티에 타입을 결정하는 PK를 조회하는 API 입니다.**    
        파티를 생성 또는 조회 시 필요합니다 (partyTypeId).
        `,
      }),
      ApiResponse({
        status: 200,
        description: `파티 타입 조회 성공  
        \`\`\`
        1.미정  2.스터디  3.포트폴리오  4.해커톤  5.공모전
        \`\`\`
        `,
        type: PartyTypeResponseDto,
      }),
    );
  }

  static createParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 생성',
        description: `**새로운 파티를 생성하는 API 입니다.**  
        1. multipart/form-data 형식을 사용합니다.  
        2. 이미지를 저장하는 key는 image 이며, 선택사항 (optional) 입니다.  
        \`\`\`image : 파티에 대한 이미지 파일을 업로드합니다. (jpg, png, jpeg 파일 첨부)  \`\`\`  
        3. 이미지 데이터가 없으면 **null** 으로 저장됩니다.  
        4. positionId : 파티를 생성하는 유저가 담당할 포지션 ID(PK)를 입력합니다.
        `,
      }),
      ApiResponse({
        status: 201,
        description: '파티 생성',
        type: PartyResponseDto,
      }),
    );
  }

  static getParties() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 목록 조회',
        description: `**파티 목록을 조회하는 API 입니다.**  

        total : 파티 전체 데이터 수

        parties : 요청한 limit 만큼의 데이터를 리턴합니다.
        - tag : 파티에 표시할 태그를 리턴합니다.
            진행중 : 파티가 진행 되지만, 파티원를 모집하지 않을 때  
            모집중 : 파티원 모집 공고가 존재 할 때
            파티 종료 : 파티 종료시
        - partyType : 해당 파티의 타입을 나타냅니다.
        `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 목록 리스트 조회',
        type: GetPartiesResponseDto,
      }),
    );
  }

  static getParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 상세 정보 조회',
        description: `**파티 상세 정보 조회하는 API 입니다.**  

        partyUser : 파티에 속한 유저 데이터 입니다.
        partyType : 해당 파티의 타입을 나타냅니다.
        `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 상세 정보 조회',
        type: GetPartyResponseDto,
      }),
    );
  }

  static updateParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 수정',
        description: `**파티를 수정하는 API 입니다.**  
        1. multipart/form-data 형식을 사용합니다.  
        2. 이미지를 수정하는 key는 image 입니다.  
        \`\`\`image : 파티에 대한 이미지 파일을 업로드합니다. (jpg, png, jpeg 파일 첨부)  \`\`\`  
        3. 모든 항목이 선택사항 (optional) 입니다.  
        4. 이미지 데이터가 없으면 변경하지 않습니다.  
        `,
      }),
      ApiResponse({
        status: 200,
        description: '파티 수정 완료',
        type: PartyResponseDto,
      }),
    );
  }

  static deleteParty() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 삭제 (softdelete)',
        description: `**파티를 삭제(softdelete)하는 API 입니다.**  
        파티 데이터를 완전 삭제 하지 않고, 상태값을 deleted로 변경하여 데이터를 유지합니다.
        `,
      }),
      ApiResponse({
        status: 204,
        description: '삭제 완료',
      }),
    );
  }

  static deletePartyImage() {
    return applyDecorators(
      ApiOperation({
        summary: '파티 이미지 삭제',
        description: `**파티 이미지를 삭제하는 API 입니다.**  
        파티 이미지를 서버에서 삭제하고, image 데이터를 **null**로 저장합니다.
        `,
      }),
      ApiResponse({
        status: 204,
        description: '삭제 완료',
      }),
    );
  }
}