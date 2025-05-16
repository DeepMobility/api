import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToMany,
  ManyToOne
} from 'typeorm';
import { Team } from './team.entity';
import { User } from './user.entity';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ default: 0 })
  points: number;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  creator: User;

  @ManyToMany(() => Team, team => team.challenges)
  teams: Team[];

  @Column("text", { array: true, default: [] })
  requirements: string[];

  @Column("jsonb", { default: {} })
  rules: any;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
} 