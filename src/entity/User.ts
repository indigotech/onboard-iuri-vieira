import { address } from "faker";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from "typeorm";
import { Address } from "./Address";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  birthDate: string;

  @Column()
  password: string;

  @OneToMany(() => Address, (address) => address.userId)
  addresses: Address[];
}
