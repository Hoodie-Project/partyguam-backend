import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PartyRecruitmentEntity } from './party_recruitment.entity';

@Entity('party_invitation')
export class PartyInvitationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true, type: 'date' })
  created_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.partyInvitations)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PartyRecruitmentEntity, (partyRecruitment) => partyRecruitment.partyInvitaions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_id' })
  partyRecruitment: PartyRecruitmentEntity;
}
