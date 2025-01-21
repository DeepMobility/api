import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737480812849 implements MigrationInterface {
    name = 'Migration1737480812849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_787bbbb07dba81860db0803230a" UNIQUE ("accountId", "email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_787bbbb07dba81860db0803230a"`);
    }

}
