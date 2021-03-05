import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';

import User from './User.entity';
import PetPhotos from './PetPhoto.entity';
import Favorite from './Favorite.entity';

@Entity({ name: 'pets' })
export default class Pet {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.id)
  @JoinColumn()
  user: User

  @OneToMany(() => PetPhotos, petPhotos => petPhotos.pet)
  petPhotos: PetPhotos[]

  @OneToMany(() => Favorite, favorite => favorite.pet)
  favorite: Favorite[]

  @Column({ nullable: true })
  name: string

  @Column({ nullable: false, default: 'Não sei' })
  sex: string

  @Column({ nullable: false })
  status: string

  @Column({ nullable: false })
  species: string

  @Column({ nullable: false, default: 'Não sei' })
  phase: string

  @Column({ nullable: false, default: 'Não sei' })
  castration: string

  @Column({ nullable: false, default: 'Não sei' })
  race: string

  @Column({ nullable: false, default: 'Não sei' })
  vaccination: string

  @Column({ nullable: false, default: 'Não sei' })
  eyeColor: string

  @Column({ nullable: false, default: 'Não sei' })
  hairColor: string

  @Column({ nullable: true })
  feature: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
