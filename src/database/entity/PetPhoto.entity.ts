import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import Pet from './Pet.entity';

@Entity({ name: 'petPhotos' })
export default class PetPhoto {
  @PrimaryGeneratedColumn()
  id:number

  @ManyToOne(() => Pet, pet => pet.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  pet: Pet

  @Column({ nullable: false })
  photo: string

  @Column({ nullable: false })
  idPhoto: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
