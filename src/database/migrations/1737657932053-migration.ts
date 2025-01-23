import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737657932053 implements MigrationInterface {
    name = 'Migration1737657932053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "video" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "name" character varying, "description" character varying, "duration" integer, "tags" text array NOT NULL DEFAULT '{}', "courseId" integer, "coursePosition" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "video"`);
    }

}
