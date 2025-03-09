import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  Unique,
  OneToMany
} from 'typeorm';
import { Account } from './account.entity';
import { Session } from './session.entity';

@Unique(["account", "email"])
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Account, (account) => account.users, { onDelete: 'CASCADE', nullable: false })
  account: Account;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

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

  @Column({ nullable: true })
  otherThematicInterest: string;

  @Column("jsonb", { default: {} })
  survey: any;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}