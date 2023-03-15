import { AbstractEntity } from 'src/common/entities/Abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Upload extends AbstractEntity {
  @Column({ nullable: false })
  id: string;

  @Column()
  filename: string;

  @Column()
  url: string;

  @Column()
  expirationSecond: number;
}
