import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Account, (account) => account.users)
  account: Account;

  @Column()
  email: string;

  @Column()
  hashedPassword: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: string;

  @Column({ type: 'timestamptz' })
  birthDay: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}