import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769759505432 implements MigrationInterface {
    name = 'Migration1769759505432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "webinar" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "scheduled_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "teams_link" character varying NOT NULL,
                "registration_link" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                "account_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_webinar" PRIMARY KEY ("id"),
                CONSTRAINT "FK_webinar_account" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "webinar"`);
    }
}
