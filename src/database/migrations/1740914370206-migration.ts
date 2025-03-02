import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740914370206 implements MigrationInterface {
    name = 'Migration1740914370206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "painfulBodyPart"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "painfulBodyParts" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "painfulBodyParts"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "painfulBodyPart" character varying`);
    }

}
