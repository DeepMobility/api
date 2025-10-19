import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReminderTime1744000000000 implements MigrationInterface {
  name = 'AddReminderTime1744000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN "reminder_time" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP COLUMN "reminder_time"
    `);
  }
}

