import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769759505893 implements MigrationInterface {
    name = 'Migration1769759505893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "account" ADD COLUMN "configuration" jsonb NOT NULL DEFAULT '{}'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "configuration"`);
    }
}
