import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  host: string;

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}