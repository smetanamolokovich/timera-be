import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationTimezone1772200000000 implements MigrationInterface {
  name = 'AddOrganizationTimezone1772200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "timezone" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "timezone"`,
    );
  }
}
