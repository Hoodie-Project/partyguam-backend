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
import { CreatePartyApplicationHandler } from './application/command/create-partyApplication.handler';
import { CreatePartyRecruitmentHandler } from './application/command/create-partyRecruitment.handler';
import { PartyRecruitmentRepository } from './infra/db/repository/party_recruitment.repository';
import { PartyRecruitmentEntity } from './infra/db/entity/apply/party_recruitment.entity';
import { PartyApplicationRepository } from './infra/db/repository/party_application.repository';
import { DeletePartyImageHandler } from './application/command/delete-partyImage.handler';
import { GetPartyRecruitmentHandler } from './application/query/get-partyRecruitment.handler';
import { UpdatePartyRecruitmentHandler } from './application/command/update-partyRecruitment.handler';
import { DeletePartyRecruitmentHandler } from './application/command/delete-partyRecruitment.handler';
import { GetPartyApplicationsHandler } from './application/query/get-partyApplications.handler';
import { ApprovePartyApplicationHandler } from './application/command/approve-partyApplication.handler';
import { RejectionPartyApplicationHandler } from './application/command/rejection-partyApplication.handler';
import { DeletePartyUserHandler } from './application/command/delete-partyUser.handler';
import { LeavePartyHandler } from './application/command/leave-party.handler';

const uploadDir = 'images/party';

const commandHandlers = [
  CreatePartyHandler,
  UpdatePartyHandler,
  DeletePartyHandler,
  DeletePartyUserHandler,
  DeletePartyImageHandler,
  CreatePartyRecruitmentHandler,
  UpdatePartyRecruitmentHandler,
  DeletePartyRecruitmentHandler,
  CreatePartyApplicationHandler,
  LeavePartyHandler,
  ApprovePartyApplicationHandler,
  RejectionPartyApplicationHandler,
];
const queryHandlers = [
  GetPartiesHandler,
  GetPartyHandler,
  GetPartyTypesHandler,
  GetPartyRecruitmentHandler,
  GetPartyApplicationsHandler,
];
const eventHandlers = [];
const factories = [PartyFactory];

const repositories = [
  { provide: 'PartyRepository', useClass: PartyRepository },
  { provide: 'PartyUserRepository', useClass: PartyUserRepository },
  { provide: 'PartyTypeRepository', useClass: PartyTypeRepository },
  { provide: 'PartyRecruitmentRepository', useClass: PartyRecruitmentRepository },
  { provide: 'PartyApplicationRepository', useClass: PartyApplicationRepository },
];

@Module({
  controllers: [PartyController],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers, ...factories, ...repositories],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: uploadDir, // 정적 파일이 저장된 디렉토리
      serveRoot: '/' + uploadDir, // 정적 파일에 접근할 경로 설정
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
          const filename = `${uniqueSuffix}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
    CqrsModule,
    TypeOrmModule.forFeature([
      PartyEntity,
      PartyTypeEntity,
      PartyUserEntity,
      PartyRecruitmentEntity,
      PartyApplicationEntity,
      PartyInvitationEntity,
    ]),
  ],
})
export class PartyModule {}
