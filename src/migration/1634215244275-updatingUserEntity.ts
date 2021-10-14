import { MigrationInterface, QueryRunner } from "typeorm";

export class updatingUserEntity1634215244275 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "firstName" TO "name"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "lastName" TO "email"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "birthDate" varchar(12)`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "password" varchar(40)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
