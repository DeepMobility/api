import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  Unique
} from 'typeorm';
import { Account } from './account.entity';

@Unique(["account", "email"])
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Account, (account) => account.users, { onDelete: 'CASCADE', nullable: false })
  account: Account;

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

  @Column({ nullable: true })
  painfulBodyPart: string;

  @Column({ nullable: true })
  otherThematicInterest: string;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}