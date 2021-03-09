import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import Pet from './Pet.entity';
import User from './User.entity';

@Entity({ name: 'favorites' })
export default class Favorite {
  @PrimaryGeneratedColumn()
  id:number

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @ManyToOne(() => Pet, pet => pet.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  pet: Pet

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
