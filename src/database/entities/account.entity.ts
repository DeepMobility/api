import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';

export interface AccountConfiguration {
  webinarsEnabled?: boolean;
  onboardingVideoUrl?: string;
}

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

  @Column("text", { array: true, default: [], name: 'allowed_domains' })
  allowedDomains: string[];

  @Column({ type: 'jsonb', default: {}, name: 'configuration' })
  configuration: AccountConfiguration;

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @OneToMany(() => Team, (team) => team.account)
  teams: Team[];

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}