import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne
} from 'typeorm';
import { Challenge } from './challenge.entity';
import { User } from './user.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  leader: User;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @ManyToMany(() => Challenge, challenge => challenge.teams)
  challenges: Challenge[];

  @Column({ default: 0 })
  points: number;

  @Column("text", { array: true, default: [] })
  achievements: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
} 