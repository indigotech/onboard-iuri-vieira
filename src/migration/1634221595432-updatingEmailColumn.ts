import { MigrationInterface, QueryRunner } from "typeorm";

export class updatingEmailColumn1634221595432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD UNIQUE ("email")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
