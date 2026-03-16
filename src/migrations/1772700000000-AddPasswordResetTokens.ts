import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetTokens1772700000000 implements MigrationInterface {
  name = 'AddPasswordResetTokens1772700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "password_reset_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_password_reset_tokens_token" UNIQUE ("token"), CONSTRAINT "PK_password_reset_tokens_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
  }
}
