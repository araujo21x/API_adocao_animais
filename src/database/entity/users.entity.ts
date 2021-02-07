import {
  Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate
} from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity({ name: 'users' })
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword () {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}

export default User;
