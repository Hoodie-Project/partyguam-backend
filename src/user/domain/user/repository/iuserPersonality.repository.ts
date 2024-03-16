import { UserPersonalityEntity } from 'src/user/infra/db/entity/user-personality.entity';

export interface IUserPersonalityRepository {
  findByPersonalityOptionIds: (userId: number, personalityOptionIds: number[]) => Promise<UserPersonalityEntity[]>;
  findByUserId: (userId: number) => Promise<UserPersonalityEntity[]>;
  bulkInsert: (userId: number, locationIds: number[]) => Promise<UserPersonalityEntity[]>;
}