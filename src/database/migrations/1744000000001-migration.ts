import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1744000000001 implements MigrationInterface {
    name = 'Migration1744000000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "user",
            new TableColumn({
                name: "has_dashboard_access",
                type: "boolean",
                default: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "has_dashboard_access");
    }
}

