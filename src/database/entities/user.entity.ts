import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  Unique,
  OneToMany,
  ManyToMany
} from 'typeorm';
import { Account } from './account.entity';
import { Session } from './session.entity';
import { Team } from './team.entity';

@Unique(["account", "email"])
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Account, (account) => account.users, { onDelete: 'CASCADE', nullable: false })
  account: Account;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @ManyToMany(() => Team, team => team.members)
  teams: Team[];

  @Column()
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthYear: number;

  @Column({ nullable: true })
  jobType: string;

  @Column("text", { array: true, default: [] })
  painfulBodyParts: string[];

  @Column("text", { array: true, default: [] })
  otherThematicInterests: string;

  @Column("text", { array: true, default: [] })
  badges: string[];

  @Column("jsonb", { default: {} })
  survey: any;

  @Column({ default: 0 })
  daysInARow: number;

  @Column({ name: 'reminder_time', nullable: true })
  reminderTime: string;

  @Column({ name: 'has_dashboard_access', default: false })
  hasDashboardAccess: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}