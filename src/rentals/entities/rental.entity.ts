import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Motorcycle } from '../../motorcycles/entities/motorcycle.entity';

@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('date')
  startDate!: Date;

  @Column('date')
  endDate!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  })
  status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';

  @ManyToOne(() => User, (user) => user.rentals)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Motorcycle, (motorcycle) => motorcycle.rentals)
  @JoinColumn({ name: 'motorcycleId' })
  motorcycle!: Motorcycle;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
