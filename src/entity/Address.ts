import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.addresses)
  userId: User;

  @Column()
  cep: string;

  @Column()
  street: string;

  @Column()
  neighborhood: string;

  @Column()
  streetNumber: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  complement: string;
}
