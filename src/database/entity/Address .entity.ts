import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import User from './User.entity';

@Entity({ name: 'Adresses' })
export default class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn()
  user: User

  @Column({ nullable: false })
  uf: string

  @Column({ nullable: false })
  city: string

  @Column({ nullable: false })
  postalCode: string

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 8 })
  latitude: number

  @Column({ nullable: true, type: 'decimal', precision: 11, scale: 8 })
  longitude: number

  @Column({ nullable: false, default: 's/n' })
  addressNumber: string

  @Column({ nullable: true })
  complement: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
