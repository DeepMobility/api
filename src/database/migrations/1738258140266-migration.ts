import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738258140266 implements MigrationInterface {
    name = 'Migration1738258140266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "painfulBodyPart" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "otherThematicInterest" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otherThematicInterest"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "painfulBodyPart"`);
    }

}
