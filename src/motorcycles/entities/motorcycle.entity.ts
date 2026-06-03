import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Rental } from '../../rentals/entities/rental.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('motorcycles')
export class Motorcycle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column('int')
  cc!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerDay!: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @OneToMany(() => Rental, (rental) => rental.motorcycle)
  rentals!: Rental[];

  @OneToMany(() => Review, (review) => review.motorcycle)
  reviews!: Review[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
