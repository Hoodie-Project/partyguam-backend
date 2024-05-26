import { PositionEntity } from 'src/position/entity/position.entity';
import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { PartyEntity } from './party.entity';

export enum PartyAuthority {
  MASTER = 'master',
  EDITOR = 'editor',
  MEMBER = 'member',
}

@Entity('party_user')
export class PartyUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  partyId: number;

  @Column()
  positionId: number;

  @Column({ type: 'enum', enum: PartyAuthority, default: PartyAuthority.MEMBER })
  authority: string;

  @ManyToOne(() => UserEntity, (user) => user.parties, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => PartyEntity, (party) => party.partyUser, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'party_id', referencedColumnName: 'id' })
  party: PartyEntity;

  @ManyToOne(() => PositionEntity, (position) => position.partyUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'position_id', referencedColumnName: 'id' })
  position: PositionEntity;
}
