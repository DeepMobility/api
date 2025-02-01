import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column("text", { array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  course: string;

  @Column({ nullable: true })
  coursePosition: number;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;
}