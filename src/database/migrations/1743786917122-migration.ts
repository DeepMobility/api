import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743786917122 implements MigrationInterface {
    name = 'Migration1743786917122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "daysInARow" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "daysInARow"`);
    }

}
