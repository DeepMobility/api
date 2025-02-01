import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738411141561 implements MigrationInterface {
    name = 'Migration1738411141561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" ADD "thumbnailUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" DROP COLUMN "thumbnailUrl"`);
    }

}
