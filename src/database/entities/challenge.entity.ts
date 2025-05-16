import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn
} from 'typeorm';
import { Team } from './team.entity';
import { User } from './user.entity';
import { ChallengeType } from '../enums/ChallengeType';
import { ChallengeStatus } from '../enums/ChallengeStatus';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'association_name' })
  associationName: string;

  @Column({ name: 'association_logo_url' })
  associationLogoUrl: string;

  @Column({ type: 'timestamptz', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'timestamptz', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'enum', enum: ChallengeType, name: 'type' })
  type: ChallengeType;

  @Column({ type: 'enum', enum: ChallengeStatus, name: 'status' })
  status: ChallengeStatus;

  @Column({ default: 0, name: 'goal_amount' })
  goalAmount: number;

  @Column({ default: 0, name: 'conversion_rate' })
  conversionRate: number;

  @ManyToMany(() => Team, team => team.challenges)
  @JoinTable({
    name: 'challenge_team',
    joinColumn: {
      name: 'challenge_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'team_id',
      referencedColumnName: 'id'
    }
  })
  teams: Team[];

  @ManyToMany(() => User, user => user.challenges)
  @JoinTable({
    name: 'challenge_user',
    joinColumn: {
      name: 'challenge_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    }
  })
  users: User[];

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt: Date;
} 