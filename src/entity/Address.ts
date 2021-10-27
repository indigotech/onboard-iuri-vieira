import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  complement: string;
}
