import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeamsAndChallenges1743786917123 implements MigrationInterface {
  name = 'CreateTeamsAndChallenges1743786917123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."challenge_type_enum" AS ENUM ('team', 'individual')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."challenge_status_enum" AS ENUM ('pending', 'active', 'completed', 'cancelled')
    `);

    await queryRunner.query(`
      CREATE TABLE "team" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "account_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_team" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "team_member" (
        "team_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "PK_team_member" PRIMARY KEY ("team_id", "user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "challenge" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "account_id" uuid NOT NULL,
        "title" character varying NOT NULL,
        "description" text,
        "association_name" character varying NOT NULL,
        "association_logo_url" text,
        "goal_amount" decimal(10,2),
        "type" "public"."challenge_type_enum" NOT NULL DEFAULT 'individual',
        "conversion_rate" decimal(10,2),
        "status" "public"."challenge_status_enum" NOT NULL DEFAULT 'pending',
        "start_date" TIMESTAMP NULL,
        "end_date" TIMESTAMP NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_challenges" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "team"
      ADD CONSTRAINT "FK_team_account_id"
      FOREIGN KEY ("account_id")
      REFERENCES "account"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "challenge"
      ADD CONSTRAINT "FK_challenge_account_id"
      FOREIGN KEY ("account_id")
      REFERENCES "account"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "team_member"
      ADD CONSTRAINT "FK_team_member_team_id"
      FOREIGN KEY ("team_id")
      REFERENCES "team"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "team_member"
      ADD CONSTRAINT "FK_team_member_user_id"
      FOREIGN KEY ("user_id")
      REFERENCES "user"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_team_member_user_id"`);
    await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_team_member_team_id"`);
    await queryRunner.query(`ALTER TABLE "challenge" DROP CONSTRAINT "FK_challenge_account_id"`);
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_team_account_id"`);
    await queryRunner.query(`DROP TABLE "challenge"`);
    await queryRunner.query(`DROP TABLE "team_member"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TYPE "public"."challenge_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."challenge_type_enum"`);
  }
} 