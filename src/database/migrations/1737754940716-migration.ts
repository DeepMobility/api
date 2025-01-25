import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737754940716 implements MigrationInterface {
    name = 'Migration1737754940716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "video" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "name" character varying, "description" character varying, "duration" integer, "tags" text array NOT NULL DEFAULT '{}', "course" character varying, "coursePosition" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "jobType" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "jobType"`);
        await queryRunner.query(`DROP TABLE "video"`);
    }

}
