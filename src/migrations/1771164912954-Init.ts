import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1771164912954 implements MigrationInterface {
  name = 'Init1771164912954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "name" TYPE character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" ALTER COLUMN "name" TYPE character varying`,
    );
  }
}
