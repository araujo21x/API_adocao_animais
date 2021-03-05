import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn
} from 'typeorm';

import Pet from './Pet.entity';

@Entity({ name: 'petPhotos' })
export default class PetPhoto {
  @PrimaryGeneratedColumn()
  id:number

  @OneToMany(() => Pet, pet => pet.id)
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
