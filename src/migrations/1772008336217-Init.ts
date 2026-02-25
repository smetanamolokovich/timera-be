import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1772008336217 implements MigrationInterface {
  name = 'Init1772008336217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "time_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employeeId" uuid NOT NULL, "projectId" uuid NOT NULL, "workTypeId" uuid NOT NULL, "description" character varying(255) NOT NULL, "hours" numeric(5,2) NOT NULL, "date" date NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_b8bc5f10269ba2fe88708904aa0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "userId" uuid, "name" character varying(100) NOT NULL, "hourlyRate" numeric(10,2), "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "name" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "work_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_629764f4f43f08b045de838bedd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_entries" ADD CONSTRAINT "FK_51968b28a513c6a151cabe61bb0" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_entries" ADD CONSTRAINT "FK_f051d95ecf3cd671445ef0c9be8" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_entries" ADD CONSTRAINT "FK_6f766216f13458678d28de1f9d9" FOREIGN KEY ("workTypeId") REFERENCES "work_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" ADD CONSTRAINT "FK_abdeaa85e3452405517863b5a2b" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" ADD CONSTRAINT "FK_737991e10350d9626f592894cef" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_eec93fd979bdcf5a0141da324d6" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_types" ADD CONSTRAINT "FK_246916833f93f34cdf5bcd43e20" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_types" DROP CONSTRAINT "FK_246916833f93f34cdf5bcd43e20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_eec93fd979bdcf5a0141da324d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" DROP CONSTRAINT "FK_737991e10350d9626f592894cef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" DROP CONSTRAINT "FK_abdeaa85e3452405517863b5a2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_entries" DROP CONSTRAINT "FK_6f766216f13458678d28de1f9d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_entries" DROP CONSTRAINT "FK_f051d95ecf3cd671445ef0c9be8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "time_entries" DROP CONSTRAINT "FK_51968b28a513c6a151cabe61bb0"`,
    );
    await queryRunner.query(`DROP TABLE "work_types"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(`DROP TABLE "time_entries"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
