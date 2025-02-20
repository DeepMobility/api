import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE', nullable: false })
  user: User;

  @ManyToOne(() => Video, (video) => video.sessions, { onDelete: 'CASCADE', nullable: false })
  video: Video;

  @Column({ nullable: true })
  question: string;

  @Column({ nullable: true })
  beforeRating: number;

  @Column({ nullable: true })
  afterRating: number;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}