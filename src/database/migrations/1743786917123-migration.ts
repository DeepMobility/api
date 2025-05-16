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
      CREATE TABLE "teams" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_teams" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "team_members" (
        "team_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "PK_team_members" PRIMARY KEY ("team_id", "user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "challenges" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "association_name" character varying NOT NULL,
        "goal_amount" decimal(10,2) NOT NULL,
        "type" "public"."challenge_type_enum" NOT NULL DEFAULT 'individual',
        "conversion_rate" decimal(10,2) NOT NULL,
        "status" "public"."challenge_status_enum" NOT NULL DEFAULT 'pending',
        "start_date" TIMESTAMP NULL,
        "end_date" TIMESTAMP NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_challenges" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "challenge_teams" (
        "challenge_id" uuid NOT NULL,
        "team_id" uuid NOT NULL,
        CONSTRAINT "PK_challenge_teams" PRIMARY KEY ("challenge_id", "team_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "challenge_users" (
        "challenge_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        CONSTRAINT "PK_challenge_users" PRIMARY KEY ("challenge_id", "user_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "team_members"
      ADD CONSTRAINT "FK_team_members_team_id"
      FOREIGN KEY ("team_id")
      REFERENCES "teams"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "team_members"
      ADD CONSTRAINT "FK_team_members_user_id"
      FOREIGN KEY ("user_id")
      REFERENCES "user"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "challenge_teams"
      ADD CONSTRAINT "FK_challenge_teams_challenge_id"
      FOREIGN KEY ("challenge_id")
      REFERENCES "challenges"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "challenge_teams"
      ADD CONSTRAINT "FK_challenge_teams_team_id"
      FOREIGN KEY ("team_id")
      REFERENCES "teams"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "challenge_users"
      ADD CONSTRAINT "FK_challenge_users_challenge_id"
      FOREIGN KEY ("challenge_id")
      REFERENCES "challenges"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "challenge_users"
      ADD CONSTRAINT "FK_challenge_users_user_id"
      FOREIGN KEY ("user_id")
      REFERENCES "user"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "challenge_users" DROP CONSTRAINT "FK_challenge_users_user_id"`);
    await queryRunner.query(`ALTER TABLE "challenge_users" DROP CONSTRAINT "FK_challenge_users_challenge_id"`);
    await queryRunner.query(`ALTER TABLE "challenge_teams" DROP CONSTRAINT "FK_challenge_teams_team_id"`);
    await queryRunner.query(`ALTER TABLE "challenge_teams" DROP CONSTRAINT "FK_challenge_teams_challenge_id"`);
    await queryRunner.query(`ALTER TABLE "team_members" DROP CONSTRAINT "FK_team_members_user_id"`);
    await queryRunner.query(`ALTER TABLE "team_members" DROP CONSTRAINT "FK_team_members_team_id"`);
    await queryRunner.query(`DROP TABLE "challenge_users"`);
    await queryRunner.query(`DROP TABLE "challenge_teams"`);
    await queryRunner.query(`DROP TABLE "challenges"`);
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(`DROP TYPE "public"."challenge_type_enum"`);
  }
} 