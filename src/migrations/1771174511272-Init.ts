import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1771174511272 implements MigrationInterface {
  name = 'Init1771174511272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ownerUserId" uuid NOT NULL, "name" character varying(100) NOT NULL, "hourlyRate" numeric, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" ADD CONSTRAINT "FK_e98be6c449f58702b12e214bdfa" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employees" DROP CONSTRAINT "FK_e98be6c449f58702b12e214bdfa"`,
    );
    await queryRunner.query(`DROP TABLE "employees"`);
  }
}
