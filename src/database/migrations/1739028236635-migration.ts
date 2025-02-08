import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739028236635 implements MigrationInterface {
    name = 'Migration1739028236635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "bodyParts" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "video" ADD "injuryTypes" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "injuryTypes"`);
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "bodyParts"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "tags" text array NOT NULL DEFAULT '{}'`);
    }

}
