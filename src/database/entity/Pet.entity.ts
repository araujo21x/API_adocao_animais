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

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @OneToMany(() => PetPhotos, petPhotos => petPhotos.pet, { cascade: true })
  petPhotos: PetPhotos[]

  @OneToMany(() => Favorite, favorite => favorite.pet, { cascade: true })
  favorite: Favorite[]

  @Column({ nullable: true, default: 'Sem informação' })
  name: string

  @Column({ nullable: false, default: 'Sem informação' })
  sex: string

  @Column({ nullable: false })
  status: string

  @Column({ nullable: false })
  species: string

  @Column({ nullable: false })
  phase: string

  @Column({ nullable: false, default: 'Sem informação' })
  castration: string

  @Column({ nullable: false, default: 'Sem informação' })
  race: string

  @Column({ nullable: false, default: 'Sem informação' })
  vaccination: string

  @Column({ nullable: false, default: 'Sem informação' })
  eyeColor: string

  @Column({ nullable: false, default: 'Sem informação' })
  hairColor: string

  @Column({ nullable: true })
  feature: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
