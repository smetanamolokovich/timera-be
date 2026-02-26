import { MigrationInterface, QueryRunner } from 'typeorm';

export class MembershipEntityAndMembershipPropsUpdate1772132608667 implements MigrationInterface {
  name = 'MembershipEntityAndMembershipPropsUpdate1772132608667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."invitations_role_enum" AS ENUM('OWNER', 'MANAGER', 'MEMBER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitations" ("id" uuid NOT NULL, "organizationId" character varying NOT NULL, "role" "public"."invitations_role_enum" NOT NULL, "token" character varying NOT NULL, "createdByUserId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "invitedEmail" character varying, "usedAt" TIMESTAMP, CONSTRAINT "UQ_e577dcf9bb6d084373ed3998509" UNIQUE ("token"), CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "role"`);
    await queryRunner.query(
      `CREATE TYPE "public"."memberships_role_enum" AS ENUM('OWNER', 'MANAGER', 'MEMBER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD "role" "public"."memberships_role_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."memberships_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD "role" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "invitations"`);
    await queryRunner.query(`DROP TYPE "public"."invitations_role_enum"`);
  }
}
