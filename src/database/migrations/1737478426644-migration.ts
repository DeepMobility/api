import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737478426644 implements MigrationInterface {
    name = 'Migration1737478426644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthDay"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birthYear" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthYear"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birthDay" TIMESTAMP WITH TIME ZONE`);
    }

}
