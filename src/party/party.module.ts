import { Module } from '@nestjs/common';
import { PartyController } from './interface/party.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyEntity } from './infra/db/entity/party/party.entity';
import { PartyFactory } from './domain/party/party.factory';
import { PartyRepository } from './infra/db/repository/party.repository';
import { CreatePartyHandler } from './application/command/create-party.handler';
import { PartyUserRepository } from './infra/db/repository/party_user.repository';
import { GetPartiesHandler } from './application/query/get-parties.handler';
import { GetPartyHandler } from './application/query/get-party.handler';
import { PartyUserEntity } from './infra/db/entity/party/party_user.entity';
import { UpdatePartyHandler } from './application/command/update-party.handler';
import { DeletePartyHandler } from './application/command/delete-party.handler';
import { PartyApplicationEntity } from './infra/db/entity/apply/party_application.entity';
import { PartyInvitationEntity } from './infra/db/entity/apply/party_invitation.entity';
import { GetPartyTypesHandler } from './application/query/get-partyTypes.handler';
import { PartyTypeEntity } from './infra/db/entity/party/party_type.entity';
import { PartyTypeRepository } from './infra/db/repository/party_type.repository';
import { MulterModule } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
const uploadDir = path.resolve(process.cwd(), '../uploads/images/party'); // 절대 경로로 설정

const commandHandlers = [CreatePartyHandler, UpdatePartyHandler, DeletePartyHandler];
const queryHandlers = [GetPartiesHandler, GetPartyHandler, GetPartyTypesHandler];
const eventHandlers = [];
const factories = [PartyFactory];

const repositories = [
  { provide: 'PartyRepository', useClass: PartyRepository },
  { provide: 'PartyUserRepository', useClass: PartyUserRepository },
  { provide: 'PartyTypeRepository', useClass: PartyTypeRepository },
];

@Module({
  controllers: [PartyController],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: uploadDir, // 정적 파일이 저장된 디렉토리
      serveRoot: uploadDir, // 정적 파일에 접근할 경로 설정
    }),
    MulterModule.register({
      // dest: '../upload',
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(new Error('Only JPG files are allowed!'), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: (req, file, callback) => {
          // 디렉토리가 존재하지 않으면 생성
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          callback(null, uploadDir);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}-${file.originalname}`); // 현재 날짜와 원래 파일 이름을 조합하여 저장
        },
      }),
    }),
    CqrsModule,
    TypeOrmModule.forFeature([
      PartyEntity,
      PartyTypeEntity,
      PartyUserEntity,
      PartyApplicationEntity,
      PartyInvitationEntity,
    ]),
  ],
})
export class PartyModule {}
