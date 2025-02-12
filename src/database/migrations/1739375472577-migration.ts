import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739375472577 implements MigrationInterface {
    name = 'Migration1739375472577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "injuryTypes"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "exerciseTypes" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "exerciseTypes"`);
        await queryRunner.query(`ALTER TABLE "video" ADD "injuryTypes" text array NOT NULL DEFAULT '{}'`);
    }

}
