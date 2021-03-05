import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import bcrypt from 'bcryptjs';

import Address from './Address .entity';
import Pet from './Pet.entity';
import Favorite from './Favorite.entity';

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Address, address => address.user)
  address: Address[]

  @OneToMany(() => Pet, pet => pet.user)
  pet: Pet[]

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorite: Favorite[]

  @Column({ nullable: false })
  name: string

  @Column({ nullable: true })
  lastName: string

  @Column({ nullable: false })
  whatsApp: string

  @Column({ nullable: true })
  telephone: string

  @Column({ nullable: false })
  type: string

  @Column({ type: 'timestamp', precision: 6, nullable: true })
  birthday: Date

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  passwordChange: boolean

  @Column({ type: 'timestamp', precision: 6, nullable: true })
  passwordChangeDate: Date

  @Column({ default: false })
  photoProfile: string

  @Column({ nullable: false, default: 'default' })
  idPhotoProfile: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword () {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}