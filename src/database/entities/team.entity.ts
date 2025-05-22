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

  @ManyToMany(() => User, user => user.teams)
  @JoinTable({
    name: 'team_member',
    joinColumns: [{
      name: 'team_id',
      referencedColumnName: 'id'
    }],
    inverseJoinColumns: [{
      name: 'user_id',
      referencedColumnName: 'id'
    }]
  })
  members: User[];

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  readonly createdAt: Date;
} 