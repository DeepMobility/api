import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';
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

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @OneToMany(() => Team, (team) => team.account)
  teams: Team[];

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}