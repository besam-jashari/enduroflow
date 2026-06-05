import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Motorcycle } from '../../motorcycles/entities/motorcycle.entity';
import { User } from '../../users/entities/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int')
  rating!: number;

  @Column('text')
  comment!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Motorcycle, (motorcycle) => motorcycle.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'motorcycleId' })
  motorcycle!: Motorcycle;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
