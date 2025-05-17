import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm';
import { Challenge } from './challenge.entity';
import { User } from './user.entity';
import { Account } from './account.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Account, account => account.teams)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'team_member',
    joinColumn: {
      name: 'team_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    }
  })
  members: User[];

  @ManyToMany(() => Challenge, challenge => challenge.teams)
  challenges: Challenge[];

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt: Date;
} 