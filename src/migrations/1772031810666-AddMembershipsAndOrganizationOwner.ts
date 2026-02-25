import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMembershipsAndOrganizationOwner1772031810666 implements MigrationInterface {
  name = 'AddMembershipsAndOrganizationOwner1772031810666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "memberships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "organizationId" uuid NOT NULL, "role" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_25d28bd932097a9e90495ede7b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "ownerId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "address" character varying(200)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "phoneNumber" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "email" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "logoUrl" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "FK_187d573e43b2c2aa3960df20b78" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "FK_98d23786d647f0ccf477b3b2867" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_cdf778d13ea7fe8095e013e34f0" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_cdf778d13ea7fe8095e013e34f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "memberships" DROP CONSTRAINT "FK_98d23786d647f0ccf477b3b2867"`,
    );
    await queryRunner.query(
      `ALTER TABLE "memberships" DROP CONSTRAINT "FK_187d573e43b2c2aa3960df20b78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "isActive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "logoUrl"`,
    );
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "phoneNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "ownerId"`,
    );
    await queryRunner.query(`DROP TABLE "memberships"`);
  }
}
