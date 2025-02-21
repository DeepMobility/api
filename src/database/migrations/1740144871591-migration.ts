import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740144871591 implements MigrationInterface {
    name = 'Migration1740144871591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "logoUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "logoUrl"`);
    }

}
