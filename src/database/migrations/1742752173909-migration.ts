import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742752173909 implements MigrationInterface {
    name = 'Migration1742752173909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "badges" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "badges"`);
    }
}
