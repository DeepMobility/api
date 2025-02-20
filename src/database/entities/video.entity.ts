import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Session } from './session.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Session, (session) => session.video)
  sessions: Session[];

  @Column()
  url: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  course: string;

  @Column({ nullable: true })
  coursePosition: number;

  @Column("text", { array: true, default: [] })
  bodyParts: string[];

  @Column("text", { array: true, default: [] })
  exerciseTypes: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}