import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
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

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt: Date;
} 