import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743340171781 implements MigrationInterface {
    name = 'Migration1743340171781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otherThematicInterest"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "otherThematicInterests" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otherThematicInterests"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "otherThematicInterest" character varying`);
    }

}
