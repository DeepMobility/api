import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741540862049 implements MigrationInterface {
    name = 'Migration1741540862049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "survey" jsonb NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "survey"`);
    }
}
