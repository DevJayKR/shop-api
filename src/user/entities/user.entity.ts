import { InternalServerErrorException } from '@nestjs/common';
import { AbstractEntity } from 'src/common/entities/Abstract.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  public username: string;

  @Column({ nullable: false })
  public password: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Column({ nullable: false })
  public email: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
